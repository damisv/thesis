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

const router = express.Router();

// mount express paths, any addition middleware can be added as well.
// ex. router.use('/pathway', middleware_function, sub-router);

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/project', projectRouter);
router.use('/assignments', assignmentsRouter);
router.use('/invite', inviteRouter);
router.use('/chat', chatRouter);
router.use('/timeline', timelineRouter);
router.use('/calendar', calendarRouter);
// router.use('/')

// Export the router
export = router;
