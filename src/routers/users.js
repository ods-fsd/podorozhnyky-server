import { Router } from 'express';
import { getCurrentUserController } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { parsePagination } from '../middlewares/parsePagination.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const usersRouter = Router();

usersRouter.get(
  '/me',
  authenticate,
  parsePagination,
  ctrlWrapper(getCurrentUserController),
);

export default usersRouter;