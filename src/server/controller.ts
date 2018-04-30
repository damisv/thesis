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
// middlewares
import {hasValidToken} from './utils';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', hasValidToken, userRouter);
router.use('/project', hasValidToken, projectRouter);
router.use('/assignments', hasValidToken, assignmentsRouter);
router.use('/invite', hasValidToken, inviteRouter);
router.use('/chat', hasValidToken, chatRouter);
router.use('/timeline', hasValidToken, timelineRouter);
router.use('/calendar', hasValidToken, calendarRouter);

// Export the router
export = router;
