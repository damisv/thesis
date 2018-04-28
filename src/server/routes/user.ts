import * as express from 'express';
const router = express.Router();

// Authorization header ...

/**
 * @method - GET
 * Get current user
 * Email/id will be taken from token
 * @returns - {user: the user profile }
 */
router.get('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get this user'});
});

/**
 * @method - PUT
 * Edit current user
 * Email/id will be taken from token
 * @body - Contains 1 value => user: User profile
 * @returns Void - success 200 is ok
 */
router.put('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'edit this user'});
});

/**
 * @method - GET
 * Get user by email
 * @param - user email
 * @returns User profile
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'edit this user'});
});

/**
 * @method - GET
 * Check if exists user
 * @param - user email
 * @returns Boolean
 */
router.get('/isRegistered/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'check if user exists'});
});

/**
 * @method - GET
 * Search by email
 * @param - user email
 * @returns Array of emails that look alike ?
 */
router.get('/search/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'search by email'});
});

// Export the router
export = router;
