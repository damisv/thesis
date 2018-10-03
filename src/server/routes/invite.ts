import * as express from 'express';
import {DbKeys} from '../database/utils';
import * as assert from 'assert';
import {checkBody, checkParams, StatusMessages} from '../utils';
import {Error} from '../../client/app/models/error';
import DbClient = require('../database/dbClient');
import {ioServer} from '../../main';
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();

/**
 * @method - GET
 * Get user invites
 * The id or email will be taken from the authorization header, as long as the token is ok.
 * @returns Array of invites in the form of: {project: string, name: string}
 */
router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({invites : {$in: [  email ]}}, DbKeys.invites, { project: 1, _id: 0});
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get project invites
 * @param ID of project
 * @returns Array of invites in the form of {email: string, position: number/enum, status: boolean (accepted/not)}
 */
router.get('/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.find({project_id: req.params.id }, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send( result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Creates invites from the emails given for the specific project id
 * Email from token should be used to check if user can invite ?
 * @body Contains 2 values:
 *                1) invites - Array of emails to invite
 *                2) projectID - The id of project to invite
 *                3) projectName - the name of the project
 * @returns Void - success 200 is needed only
 */
router.post('/', checkBody, async function(req, res) {
  try {
    const result = await DbClient.updateOne({project: ObjectID(req.body.projectID)},
      {$addToSet: { invites: { $each: req.body.invites}}}, DbKeys.invites);
    assert.notEqual(null, result);
    if ( req.body.invites.length > 0) {
      await inviteMembersNotifications(req.body.invites, req.body.projectID, req.body.projectName);
    }
    res.status(200).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

async function inviteMembersNotifications(invites: string[], projectID: string, projectName: string) {
  try {
    const notifications = invites.map( email => ({email: email,
      project: projectID,
      project_name: projectName,
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
 * @method - PATCH
 * Accepts the invite to project id
 * Email will be taken from token
 * @param - Project ID
 * @returns Project
 */
router.patch('/:id', checkParams, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    console.log('project id ' + req.params.id);
    const resultProject = await  DbClient.updateOne({_id: ObjectID(req.params.id)},
      {$addToSet: {team: {email: email, position: 1}}}, DbKeys.projects);
    assert.notEqual(null, resultProject);
    const result = await DbClient.updateOne(
      {project: ObjectID(req.params.id) }, { $pull: { invites: { $in: [ email ] }}}, DbKeys.invites);
    assert.notEqual(null, result);
    ioServer.memberJoinedProject(req.params.id, email);
    const projectTemp = await DbClient.findOne({_id: ObjectID(req.params.id)}, DbKeys.projects);
    res.status(200).send(projectTemp);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PATCH
 * Manager deletes the invite to member
 * @body - Project ID, email
 * @returns Void - success 200 is needed only
 */
router.patch('/deleteInvite', checkParams, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const resultManager = await DbClient.findOne({_id: ObjectID(req.body.projectID) ,
      team: {email: email, position: 0}}, DbKeys.projects);
    console.log('manager?');
    assert.notEqual(null, resultManager);
    console.log('yes manager');
    const result = await DbClient.updateOne({project: req.body.projectID},
      {$pull : { invites: {$in: [req.body.email]}}}, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - DELETE
 * Deletes the invite to project id
 * @param - Project ID
 * @returns Void - success 200 is needed only
 */
router.delete('/:id', checkBody, async function(req, res) {
  const email = req['decoded'].info.email;
  const result = await DbClient.updateOne({project: req.params.id},
    {$pull : { invites: {$in: [email]}}}, DbKeys.invites);
  assert.notEqual(null, result);
  console.log('delete ' + email);
  res.status(200).send();
});

/**
 * @method - POST
 * Check if user is invited already
 * @body - Contains 2 values :
 *                            1) email: string - the user email searching for
 *                            2) projectID: string - the project id invite is destined
 * @returns Boolean
 */
router.post('/isInvited', checkBody, async function(req, res) {
  try {
    const result = await DbClient.findOne({project: req.body.projectID , invites : {$in: [req.body.email]}}, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send(true);
  } catch (error) { res.status(200).send(false); }
});

// Export the router
export = router;
