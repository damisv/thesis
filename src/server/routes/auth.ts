import * as express from 'express';
const router = express.Router();

/**
 * @method - POST
 * Sign In
 * @body - Contains 1 value => account: Account (JSON) - the email & password
 * @returns Object with 2 values : {token: token, user: the user profile }
 */
router.post('/signin', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signin WORKS'});
});

/**
 * @method - POST
 * Sign In
 * @body - Contains 2 values :
 *                            1) account: Account (JSON) - the email & password
 *                            2) user: User (JSON) - the user profile that will be added after successfull signup
 * @returns Void - Success 200 is ok
 */
router.post('/signup', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signup WORKS'});
});

// Export the router
export = router;

