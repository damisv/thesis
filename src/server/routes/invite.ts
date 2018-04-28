import * as express from 'express';
const router = express.Router();

// Authorization ...

/**
 * @method - GET
 * Get user invites
 * The id or email will be taken from the authorization header, as long as the token is ok.
 * @returns Array of invites in the form of: {projectId: string, name: string, position: number/enum}
 */
router.get('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'invites'});
});

/**
 * @method - GET
 * Get project invites
 * @param ID of project
 * @returns Array of invites in the form of {email: string, position: number/enum, status: boolean (accepted/not)}
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'project invites'});
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
router.post('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'invites'});
});

/**
 * @method - PATCH
 * Accepts the invite to project id
 * Email will be taken from token
 * @param - Project ID
 * @returns Void - success 200 is needed only
 */
router.patch('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'invites'});
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
router.delete('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'invites'});
});

// Export the router
export = router;
