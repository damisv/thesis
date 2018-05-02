import * as express from 'express';
import {Error} from '../../client/app/models/error';
import {DbKeys} from '../database/utils';
import DbClient = require('../database/dbClient');
const ObjectID = require('mongodb').ObjectID;
import {checkBody, checkParams, StatusMessages} from '../utils';
import * as assert from 'assert';
const router = express.Router();

/**
 * @method - GET
 * Get logs of project
 * @param - project id
 * @returns Array of TimelineLog(name: string, description: string, date: Date)
 */
router.post('/', checkBody, async function(req, res) {
  try {
    const result = await DbClient.insertOne(req.body.notification, DbKeys.notifications);
    assert.notEqual(null, result);
    res.status(204).send(result.ops[0]);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({email: email}, DbKeys.notifications);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.put('/:id', checkParams, checkBody, async function(req, res) {
  try {
    const result = await DbClient.updateOne({ _id : req.params.id} ,  req.body.notification , DbKeys.notifications);
    assert.equal(1, result.result.ok);
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

router.delete('/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.deleteOne({ _id : req.params.id}  , DbKeys.notifications);
    assert.equal(1, result.result.ok);
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
