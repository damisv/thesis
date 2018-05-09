import * as express from 'express';
import {DbKeys} from '../database/utils';
import {Error} from '../../client/app/models/error';
import * as assert from 'assert';
const router = express.Router();
import DbClient = require('../database/dbClient');
import {checkBody, checkParams, StatusMessages} from '../utils';
import {ioServer} from '../../main';
const ObjectID = require('mongodb').ObjectID;

/**
 * @method - POST
 * Send Message
 * @body - Contains 1 value => message: Message (JSON) - it has the project id as receiver
 * @returns Void - success 204 is ok
 */
router.post('/', checkBody, async function(req, res) {
  try {
    const result = await DbClient.insertOne(req.body.message, DbKeys.chat);
    assert.notEqual(null, result);
    ioServer.sentMessageProject(req.body.message.receiver, result.ops[0]._id);
    res.status(204).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});
/**
 * @method - POST
 * Get Threads
 * @body - Contains 1 value => projects: {id: string, name: string] - the project's id and name
 * @returns Map of thread id and ChatThread(id: receiver, name: string, lastMessages: Message[]
 * (here should be last 20 or just empty array), read: boolean)
 */
router.post('/threads', checkBody, async function(req, res) {
  const ids = req.body.projects.map(value => value.id);
  const temp = {};
  req.body.projects.forEach(value => {
    temp[value.id] = {id: value.id, name: value.name, lastMessages: [], read : false};
  });
  try {
    const result = await DbClient.find( {receiver : {$in: ids } }, DbKeys.chat);
    assert.notEqual(null, result);
    result.forEach(message => temp[message.receiver].lastMessages.push(message));
    res.status(200).send(temp);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get messages for thread
 * @param - project id -- receiver -- chatthread id
 * @returns - Array of Messages[]
 */
router.get('/threads/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.find(req.params.id, DbKeys.chat);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;

