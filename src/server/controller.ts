import * as express from 'express';

// import sub-routers
import * as authRouter from './routes/auth';
import * as projectRouter from './routes/project';
import * as userRouter from './routes/user';
import * as assignmentsRouter from './routes/assignments';
import * as inviteRouter from './routes/invite';
import * as chatRouter from './routes/chat';
import * as timelineRouter from './routes/timeline';
import * as calendarRouter from './routes/calendar';
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use('/auth', authRouter);

// route middleware to verify a token
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers.authorization;

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) { return res.send({ title: 'Token Unauthorized', error: { message: 'Failed to authenticate token.'}});
      } else {
        // if everything is good, save to request for use in other routes
        req['decoded'] = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ title: 'Unauthorized', error: { message: 'Failed to provide token.'}});
  }
});

router.use('/user', userRouter);
router.use('/project', projectRouter);
router.use('/assignments', assignmentsRouter);
router.use('/invite', inviteRouter);
router.use('/chat', chatRouter);
router.use('/timeline', timelineRouter);
router.use('/calendar', calendarRouter);

// Export the router
export = router;
