import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { updateStoryController } from '../controllers/stories.js';
import { updateStorySchema } from '../validation/stories.js';

const storiesRouter = Router();

storiesRouter.patch(
  '/:storyId',
  authenticate,
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

export default storiesRouter;