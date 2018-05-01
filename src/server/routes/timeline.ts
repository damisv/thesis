import * as express from 'express';
import {Error} from '../../client/app/models/error';
import {DbKeys} from '../database/utils';
import DbClient = require('../database/dbClient');
import {checkParams, StatusMessages} from '../utils';
import * as assert from 'assert';
const router = express.Router();

/**
 * @method - GET
 * Get logs of project
 * @param - project id
 * @returns Array of TimelineLog(name: string, description: string, date: Date)
 */
router.get('/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.findOne({_id: Object(req.params.id)}, DbKeys.timeline);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;

