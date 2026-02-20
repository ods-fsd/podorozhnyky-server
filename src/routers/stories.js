// src/routers/stories.js
import { Router } from 'express';
import {
  createStoryController,
  deleteStoryByIdController,
  getStoriesController,
  getStoryByIdController,
  updateStoryController,
} from '../controllers/stories.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';

const storiesRouter = Router();

/**
 * ПУБЛІЧНІ РОУТИ
 * Оскільки в index.js ми підключили цей роутер як .use('/stories', ...),
 * то тут ми використовуємо шлях '/', що в сумі дає GET /stories
 */
storiesRouter.get('/', ctrlWrapper(getStoriesController));

// Шлях /:storyId в сумі дасть GET /stories/:storyId
storiesRouter.get(
  '/:storyId',
  isValidId('storyId'),
  ctrlWrapper(getStoryByIdController),
);

/**
 * ПРИВАТНІ РОУТИ (Потребують авторизації)
 */
storiesRouter.use(authenticate);

storiesRouter.post(
  '/',
  upload.single('storyImage'),
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

storiesRouter.patch(
  '/:storyId',
  isValidId('storyId'),
  upload.single('storyImage'),
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

storiesRouter.delete(
  '/:storyId',
  isValidId('storyId'),
  ctrlWrapper(deleteStoryByIdController),
);

export default storiesRouter;