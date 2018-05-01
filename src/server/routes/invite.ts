import * as express from 'express';
import {DbKeys} from '../database/utils';
import * as assert from 'assert';
import {checkParams, StatusMessages} from '../utils';
import {Error} from '../../client/app/models/error';
import DbClient = require('../database/dbClient');
const router = express.Router();

// Authorization ...

/**
 * @method - GET
 * Get user invites
 * The id or email will be taken from the authorization header, as long as the token is ok.
 * @returns Array of invites in the form of: {projectId: string, name: string, position: number/enum}
 */
router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.find({email: email }, DbKeys.invites);
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
 * @returns Void - success 200 is needed only
 */
router.post('/', checkParams, async function(req, res) {
  try {
    const result = await DbClient.insertMany({project_id: req.body.projectID, invites: req.body.invites}, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PATCH
 * Accepts the invite to project id
 * Email will be taken from token
 * @param - Project ID
 * @returns Void - success 200 is needed only
 */
router.patch('/:id', checkParams, async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.updateOne(
      {project_id: req.params.id , invites : { email: email}}, {$set : { status: 'accepted'}}, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - DELETE
 * Accepts the invite to project id
 * Email will be taken from token
 * @param - Project ID
 * @returns Void - success 200 is needed only
 */
router.delete('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'invites'});
});

/**
 * @method - POST
 * Check if user is invited already
 * @body - Contains 2 values :
 *                            1) email: string - the user email searching for
 *                            2) projectID: string - the project id invite is destined
 * @returns Boolean
 */
router.post('/isInvited', checkParams, async function(req, res) {
  try {
    const result = await DbClient.findOne({project_id: req.body.projectID , invites : { email: req.body.email}}, DbKeys.invites);
    assert.notEqual(null, result);
    res.status(200).send(true);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
