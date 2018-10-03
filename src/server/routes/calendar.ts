import * as express from 'express';
import {ioServer} from '../../main';
import {DbKeys} from '../database/utils';
import {checkBody, checkParams, StatusMessages} from '../utils';
import {Error} from '../../client/app/models/error';
import DbClient = require('../database/dbClient');
import * as assert from 'assert';
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

/**
 * @method - GET
 * Get User Calendar Events
 * Email should be taken from token
 * @returns Array of MyCalendarEvents (see calendarEvent.ts)
 */
router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({'meta.email': email }, DbKeys.calendar);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Project events
 * Email from token, check if it has rights
 * @param - project id
 * @returns Array of MyCalendarEvents (see calendarEvent.ts)
 */
router.get('/:id', checkParams, async function(req, res) {
  const project_id = req.params.id;
  try {
    const result = await DbClient.find({'meta.project_id': ObjectID(project_id)}, DbKeys.calendar);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Create
 * Email from token, check if it has rights
 * @body - Contains either 1 or 2 values: if it has projectID, then will be added to project, if not to user.
 * @returns Id of event created
 */
router.post('/', checkBody, async function(req, res) {
  const email = req['decoded'].info.email;
  let result;
  try {
    if (req.body.projectID) {
      req.body.event.meta.project_id = req.body.projectID;
    } else {
      req.body.event.meta.email = email;
    }
    result = await DbClient.insertOne(req.body.event, DbKeys.calendar);
    assert.notEqual(null, result);
    res.status(200).send(result.ops[0]._id);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PUT
 * Edit event by id
 * @body - Contains event to edit
 * @returns Void - success 200
 */
router.put('/', checkBody, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.save(req.body.event, DbKeys.calendar);
    assert.notEqual(null, result);
    res.status(200).send({});
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - DELETE
 * Delete event by id
 * @param - event id
 * @returns Void - success 200
 */
router.delete('/:id', checkParams, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.deleteOne({_id: req.params.id }, DbKeys.calendar);
    assert.notEqual(null, result);
    res.status(200).send({});
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
