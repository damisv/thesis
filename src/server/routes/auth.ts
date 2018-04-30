import * as express from 'express';
const router = express.Router();
import DbClient = require('../database/dbClient');
import * as assert from 'assert';
import {DbKeys} from '../database/utils';
const jwt = require('jsonwebtoken');

/**
 * @method - POST
 * Sign In
 * @body - Contains 1 value => account: Account (JSON) - the email & password
 * @returns  - {token: token}
 */
router.post('/signin', async function(req, res) {
  console.log(req.body);
  // bcrypt.hashSync(password,10);
  // if( bcrypt.compareSync(password, db.user.password) ) {}
  // error status 500 and 401
  if (req.body.account.isEmpty()) {console.log('EMPTY'); res.status(500); }
  try {
    const result = await DbClient.findOne(req.body.account, 'accounts');
    assert.notEqual(null, result);
    const tokenInfo = { email: result.email, _id: result._id, profile: result.profile };
    const token = await jwt.sign({ info: tokenInfo}, 'secret', {expiresIn: 7200});
    res.status(200).send({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ title: 'Login Failed', error : {message: 'Invalid login credentials'} });
  }
});

/**
 * @method - POST
 * Sign In
 * @body - Contains 2 values :
 *                            1) account: Account (JSON) - the email & password
 *                            2) user: User (JSON) - the user profile that will be added after successfull signup
 * @returns Void - Success 200 is ok
 */
router.post('/signup', async function(req, res) {
  console.log(req.body);
  try {
    const accResult = await DbClient.insertOne(req.body.account, DbKeys.accounts);
    assert.notEqual(null, accResult);
    const profileResult = await DbClient.insertOne(req.body.user, DbKeys.profiles);
    assert.notEqual(null, profileResult);
    const updateAccount = await DbClient.updateOne(
      {email: profileResult.ops[0].email},
      {$set: {profile: profileResult.ops[0]._id}},
      DbKeys.accounts);
    assert.equal(1, updateAccount.result.ok);
    const settings = {
      'myTask': 'push',
      'memberJoined': 'none',
      'invite': 'toast',
      'message': 'push',
      'error': 'push',
      'email': req.body.user.email};
    const settingsResult = await DbClient.insertOne(settings, DbKeys.settings);
    assert.notEqual(null, settingsResult);
    res.status(200).send({ title: 'OK' });
  } catch (error) {
    res.status(500).send({ title: 'An error occurred', error : error });
    console.log(error);
  }
});

// Export the router
export = router;

