import * as express from 'express';
const router = express.Router();

/**
 * @method - GET
 * Get User Calendar Events
 * Email should be taken from token
 * @returns Array of MyCalendarEvents (see calendarEvent.ts)
 */
router.get('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'user events'});
});

/**
 * @method - GET
 * Project events
 * Email from token, check if it has rights
 * @param - project id
 * @returns Array of MyCalendarEvents (see calendarEvent.ts)
 */
router.get('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signup WORKS'});
});

/**
 * @method - POST
 * Create
 * Email from token, check if it has rights
 * @body - Contains either 1 or 2 values: if it has projectID, then will be added to project, if not to user.
 * @returns Id of event created
 */
router.post('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signup WORKS'});
});

/**
 * @method - PUT
 * Edit event by id
 * @body - Contains event to edit
 * @returns Void - success 200
 */
router.put('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signup WORKS'});
});

/**
 * @method - DELETE
 * Delete event by id
 * @param - event id
 * @returns Void - success 200
 */
router.delete('/:id', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'signup WORKS'});
});

// Export the router
export = router;

