import * as express from 'express';
import {DbKeys} from '../database/utils';
import {Error} from '../../client/app/models/error';
import * as assert from 'assert';
const router = express.Router();
import DbClient = require('../database/dbClient');
import {checkBody, StatusMessages} from '../utils';

/**
 * @method - POST
 * Send Message
 * @body - Contains 1 value => message: Message (JSON) - it has the project id as receiver
 * @returns Void - success 200 is ok
 */
router.post('/', checkBody, async function(req, res) {
  try {
    const result = await DbClient.insertOne(req.body.message, DbKeys.chat);
    assert.notEqual(null, result);
    res.status(200).send({message: result});
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - POST
 * Get Threads
 * @body - Contains 1 value => projectIDs: [string] - the project id's
 * @returns Map of thread id and ChatThread(id: receiver, name: string, lastMessages: Message[]
 * (here should be last 20 or just empty array), read: boolean)
 */
router.post('/threads', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'got threads'});
});

/**
 * @method - GET
 * Get messages for thread
 * @param - project id -- receiver -- chatthread id
 * @returns - Array of Messages[]
 */
router.get('/threads', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'got messages for thread'});
});

// Export the router
export = router;

