import {
    Router
} from 'express';
import usersRouter from './users.js';
import storiesRouter from './stories.js';
import authRouter from "./auth.js";
import categoriesRouter from "./categories.js";

const router = Router();

router.use('/users', usersRouter);
router.use('/stories', storiesRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);

export default router;