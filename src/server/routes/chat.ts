import * as express from 'express';
const router = express.Router();

/**
 * @method - POST
 * Send Message
 * @body - Contains 1 value => message: Message (JSON) - it has the project id as receiver
 * @returns Void - success 200 is ok
 */
router.post('/', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'sent message'});
});

/**
 * @method - POST
 * Get Threads
 * @body - Contains 1 value => projectIDs: [string] - the project id's
 * @returns Array of ChatThread(id: receiver, name: string, lastMessages: Message[] (here should be last 20 or just empty array), read: boolean)
 */
router.post('/threads', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'got threads'});
});

/**
 * @method - GET
 * Get messages for thread
 * @param - project id -- receiver -- chatthread id
 * @returns - Array of Messages[]
 */
router.get('/threads', function(req, res) {
  console.log(req.body);
  res.status(200).send({message: 'got messages for thread'});
});

// Export the router
export = router;

