import {
    Router
} from 'express';
import usersRouter from './users.js';
import storiesRouter from './stories.js';
import authRouter from "./auth.js";

const router = Router();

router.use('/users', usersRouter);
router.use('/stories', storiesRouter);
router.use("/auth", authRouter);

export default router;
