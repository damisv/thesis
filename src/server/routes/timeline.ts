import * as express from 'express';
const router = express.Router();

/**
 * @method - GET
 * Get logs of project
 * @param - project id
 * @returns Array of TimelineLog(name: string, description: string, date: Date)
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signin WORKS'});
});

// Export the router
export = router;

