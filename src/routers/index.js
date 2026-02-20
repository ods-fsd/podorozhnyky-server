import {
    Router
} from 'express';
import usersRouter from './users.js';
import storiesRouter from './stories.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/stories', storiesRouter);

export default router;
