import * as express from 'express';
const router = express.Router();

// Authorization Header should be checked
// As it is crucial for some calls, for ex: DELETE

/**
 * @method - GET
 * Get All user projects
 * Email will be taken from Authorization Header (token)
 * @returns Array of Project
 */
router.get('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get all user projects'});
});

/**
 * @method - GET
 * Get Project By Id
 * Email will be taken from Authorization Header (token)
 * @param Project ID
 * @returns Project
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get specific project'});
});

/**
 * @method - GET
 * Get Projects By Name, and if it is public
 *  Email will be taken from Authorization Header (token)
 *  @param - Project Name
 * @returns Array of Projects
 */
router.get('/search/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get projects by name'});
});

/**
 * @method - POST
 * Creates project
 * Email will be taken from Authorization Header (token) and inserted as manager
 * @body Contains 2 values:
 *                          1) project: Project (JSON) - project to be added
 *                          2) invites array
 * @returns Void - Status 200 is ok
 */
router.post('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'create project'});
});

/**
 * @method - PUT
 * Edit project
 *  Email will be taken from Authorization Header (token) and checked if it is manager
 *  @body - Contains 1 value => project: Project
 *  @param - Project ID
 * @returns Void - Status 200 is ok
 */
router.put('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'edit project by id'});
});

/**
 * @method - POST
 * Creates project
 * Removes Member Of Project Team
 * Email should be taken from token to check if has rights
 * @body - Contains 1 value => email: string - email of member to be deleted
 * @param - project id
 * @returns Void - Status 200 is ok
 */
router.patch('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'patch project by id'});
});

/**
 * @method - DELETE
 * Deletes project
 * Email should be taken from token to check if has rights
 * @param - project id
 * @returns Void - Status 200 is ok
 */
router.delete('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'delete project by id'});
});

// Export the router
export = router;
