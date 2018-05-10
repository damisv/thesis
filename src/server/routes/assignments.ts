import * as express from 'express';
import {Error} from '../../client/app/models/error';
import {DbKeys} from '../database/utils';
import {checkBody, checkParams, hasRightsOnAssignment, StatusMessages} from '../utils';
import * as assert from 'assert';
const router = express.Router();
import DbClient = require('../database/dbClient');
import {ioServer} from '../../main';
const ObjectID = require('mongodb').ObjectID;

/**
 * @method - GET
 * Email will be taken from token
 * Get Tasks for current user
 * @returns Array of Task
 */
router.get('/task', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({assignee_email: email , type : 0 }, DbKeys.tasks);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get Issues for current user
 * Email will be taken from token
 * @returns Array of Issues
 */
router.get('/issue', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({assignee_email: email , type : 1 }, DbKeys.tasks);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get Assignments (task + issues) by project id
 * Email will be taken from token
 * @param - project id
 * @returns Array of assignments
 */
router.get('/project/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.find({project_id: req.params.id}, DbKeys.tasks);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get Assignmentby id
 * Email will be taken from token
 * @param - assignment id
 * @returns Array of assignments
 */
router.get('/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.findOne({_id: ObjectID(req.params.id) }, DbKeys.tasks);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Create Assignment
 * Email will be taken from token
 * @body - Contains 1 value => task: Task
 * @returns Void - success 200 is ok
 */
router.post('/', checkBody, async function(req, res) {
  const task = req.body.task;
  task.assigner_email = req['decoded'].info.email;
  task.date_created = new Date();
  try {
    const result = await DbClient.insertOne(task, DbKeys.tasks);
    assert.notEqual(null, result);
    const tempTask = result.ops[0];
    ioServer.newTaskArrived(tempTask);
    ioServer.taskAssignedToMembers(tempTask);
    res.status(200).send({task: tempTask});
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PUT
 * Edit assignment
 * Email will be taken from token
 * @body - Contains 1 value => task: Task
 * @param - task id
 * @returns Void - success 200 is ok
 */
router.put('/', checkBody, hasRightsOnAssignment, async function(req, res) {
  const temp = req.body.task;
  temp._id = ObjectID(req.body.task._id);
  try {
    const result = await DbClient.save(temp, DbKeys.tasks);
    assert.equal(1, result.result.ok);
    ioServer.taskEdited(req.body.task);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PATCH
 * Edit assignment status
 * @body - Contains 1 value => task: Task
 * @param - task id
 * @returns Void - success 200 is ok
 */
router.patch('/', checkBody, hasRightsOnAssignment, async function(req, res) {
  try {
    const result = await DbClient.updateOne({_id: ObjectID(req.body.task._id)},
      {$set: { completed: req.body.task.completed}}, DbKeys.tasks);
    assert.notEqual(null, result);
    ioServer.taskEdited(req.body.task);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
