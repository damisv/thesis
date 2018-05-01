import * as express from 'express';
const router = express.Router();
import DbClient = require('../database/dbClient');
import * as assert from 'assert';
import {DbKeys} from '../database/utils';
import {Error} from '../../client/app/models/error';
import {checkBody, checkParams, checkUser, StatusMessages} from '../utils';

/**
 * @method - GET
 * Get current user
 * Email/id will be taken from token
 * @returns - {user: the user profile }
 */
router.get('/', async function(req, res) {
  const email = req['decoded'].info.email;
  try {
    const result = await DbClient.findOne({email: email}, DbKeys.profiles);
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - PUT
 * Edit current user
 * Email/id will be taken from token
 * @body - Contains 1 value => user: User profile
 * @returns Void - success 200 is ok
 */
router.put('/', checkBody, checkUser, async function(req, res) {
  const email = req['decoded'].info.email;
  const user = req.body.user;
  try {
    const result = await DbClient.updateOne(
      {email: email},
      {
        $set: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          city: user.city,
          country: user.country,
          description: user.description
        }
      }, DbKeys.profiles);
    assert.equal(1, result.result.ok);
    res.status(200).send();
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

/**
 * @method - GET
 * Get user by email
 * @param - user email
 * @returns User profile
 */
router.get('/:id', checkParams, async function(req, res) {
  try {
    const user = await DbClient.findOne({email: req.params.id}, DbKeys.profiles);
    assert.notEqual(null, user);
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(new Error(StatusMessages._404));
  }
});

/**
 * @method - GET
 * Check if exists user
 * @param - user email
 * @returns Boolean
 */
router.get('/isRegistered/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.findOne({email: req.params.id}, DbKeys.profiles);
    assert.notEqual(null, result);
    res.status(200).send(true);
  } catch (error) { res.status(200).send(false); }
});

/**
 * @method - GET
 * Search by email
 * @param - user email
 * @returns Array of emails that look alike
 */
router.get('/search/:id', checkParams, async function(req, res) {
  try {
    const result = await DbClient.find({email: { $regex: new RegExp('^' + req.params.id, 'i')} }, DbKeys.profiles, { email: 1, _id: 0});
    assert.notEqual(null, result);
    res.status(200).send(result);
  } catch (error) { res.status(500).send(new Error(StatusMessages._500)); }
});

// Export the router
export = router;
