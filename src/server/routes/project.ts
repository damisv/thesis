import * as express from 'express';
const router = express.Router();
import DbClient = require('../database/dbClient');
const ioServer = require('../../main').ioServer;
const ObjectID = require('mongodb').ObjectID;
import * as assert from 'assert';
import {DbKeys} from '../database/utils';
import {Error} from '../../client/app/models/error';
import {checkBody, isManager, StatusMessages} from '../utils';

/**
 * @method - GET
 * Get All user projects
 * @returns Array of Project
 */
router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({'team.email': email}, DbKeys.projects);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get Project By Id
 * @param Project ID
 * @returns Project
 */
router.get('/:id', async function(req, res) {
  try {
    const project = await DbClient.findOne( {_id: ObjectID(req.params.id)}, DbKeys.projects);
    assert.notEqual(null, project);
    res.status(200).send(project);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get Projects By Name, and if it is public?
 *  @param - Project Name
 * @returns Array of Projects
 */
router.get('/search/:id', async function(req, res) {
  try {
    const result = await DbClient.find({name: {$regex: new RegExp('^' + req.params.id, 'i')},
      typeOf: 'public'}, DbKeys.projects, {name: 1, _id: 1});
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Creates project
 * Email will be taken from Authorization Header (token) and inserted as manager
 * @body Contains 2 values:
 *                          1) project: Project (JSON) - project to be added
 *                          2) invites array
 * @returns Void - Status 204
 */
router.post('/', checkBody, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.insertOne(req.body.project, DbKeys.projects);
    assert.notEqual(null, result);
    res.status(204).send(result.ops[0]);
    ioServer.addProject(result.ops[0]._id, result.ops[0].name);
    ioServer.joinRoom(result.ops[0]._id, email);
    const timeline = await DbClient.insertOne({name: result.ops[0].name, date: new Date(Date.now()),
                                                description: 'Project created', project: result.ops[0]._id}, DbKeys.timeline);
    assert.notEqual(null, timeline);
    await inviteMembersNotifications(req.body.invites, result.ops[0]._id);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

async function inviteMembersNotifications(invites: string[], projectID: string) {
  try {
    const result = await DbClient.insertOne(invites, DbKeys.invites);
    assert.equal(1, result.result.ok);
    const notifications = invites.map( email => ({email: email,
      type: 'invite',
      link: ['app', 'invites'],
      date: new Date(Date.now()),
      status: 'unseen'}));
    const notificationsResult = await DbClient.insertMany(notifications, DbKeys.notifications);
    assert.notEqual(null, notificationsResult);
    ioServer.inviteMemberToProject(projectID, notifications);
  } catch (error) { console.log(error); }
}

/**
 * @method - PUT
 * Edit project
 *  @body - Contains 1 value => project: Project
 *  @param - Project ID
 * @returns Void - Status 204
 */
router.put('/:id', isManager, async function(req, res) {
  const tempProject = req.body.project;
  tempProject._id = ObjectID(req.params.id);
  try {
    const result = await DbClient.save(tempProject, DbKeys.projects);
    assert.equal(1, result.result.ok);
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Removes Member Of Project Team
 * @body - Contains 1 value => email: string - email of member to be deleted
 * @param - project id
 * @returns Void - Status 204
 */
router.patch('/:id', isManager, async function(req, res) {
  try {
    const result = await DbClient.updateOne({ _id: req.params.id}, {$pull: {'team': {'email': req.body.email}}}, DbKeys.projects);
    assert.notEqual(null, result);
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - DELETE
 * Deletes project
 * @param - project id
 * @returns Void - Status 200 is ok
 */
router.delete('/:id', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.findOne( {_id: ObjectID(req.params.id)}, DbKeys.projects);
    assert.notEqual(null, result);
    if (result.team.find(member => member.email === email && member.position === 0) !== undefined) {
      const deleteResult = await DbClient.deleteOne({_id: ObjectID(req.params.id)}, DbKeys.projects);
      assert.notEqual(null, deleteResult);
    }
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
