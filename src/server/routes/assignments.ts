import * as express from 'express';
const router = express.Router();

/**
 * @method - GET
 * Email will be taken from token
 * Get Tasks for current user
 * @returns Array of Task
 */
router.get('/task', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get tasks'});
});

/**
 * @method - GET
 * Get Issues for current user
 * Email will be taken from token
 * @returns Array of Issues
 */
router.get('/issue', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get issues'});
});

/**
 * @method - GET
 * Get Assignments (task + issues) by project id
 * Email will be taken from token
 * @param - project id
 * @returns Array of assignments
 */
router.get('/project/:id', function(req, res) {
  console.log(req.params.id);
  res.status(200).send({message: 'get project assignment (task + issues)'});
});

/**
 * @method - GET
 * Get Assignmentby id
 * Email will be taken from token
 * @param - assignment id
 * @returns Array of assignments
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'get project assignment (task + issues)'});
});

/**
 * @method - POST
 * Create Assignment
 * Email will be taken from token
 * @body - Contains 1 value => task: Task
 * @returns Void - success 200 is ok
 */
router.post('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'create assignment'});
});

/**
 * @method - PUT
 * Edit assignment
 * Email will be taken from token
 * @body - Contains 1 value => task: Task
 * @param - task id
 * @returns Void - success 200 is ok
 */
router.put('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'edit assignment'});
});

/**
 * @method - PATCH
 * Edit assignment status
 * Email will be taken from token
 * @body - Contains 1 value => task: Task
 * @param - task id
 * @returns Void - success 200 is ok
 */
router.patch('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'edit status of assignment'});
});

// Export the router
export = router;

