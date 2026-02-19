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
 * ПУБЛІЧНІ МАРШРУТИ
 * Доступні всім користувачам, навіть неавторизованим.
 * Саме ці ендпоінти я буду використовувати на сторінці "Історії мандрівників".
 */

// Отримання списку всіх історій (з підтримкою пагінації та фільтрації за категоріями)
storiesRouter.get('/', ctrlWrapper(getStoriesController));

// Отримання детальної інформації про одну конкретну історію за її ID
storiesRouter.get(
  '/:storyId',
  isValidId('storyId'),
  ctrlWrapper(getStoryByIdController),
);

/**
 * ПРИВАТНІ МАРШРУТИ
 * Усі маршрути, що розташовані нижче мідлвара authenticate, 
 * вимагають наявності валідного токена у заголовку запиту.
 */
storiesRouter.use(authenticate);

// Створення нової історії (обов'язково з додаванням зображення через multer)
storiesRouter.post(
  '/',
  upload.single('storyImage'),
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

// Часткове оновлення історії (доступно лише власнику історії)
storiesRouter.patch(
  '/:storyId',
  isValidId('storyId'),
  upload.single('storyImage'),
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

// Видалення історії за її ID (доступно лише власнику історії)
storiesRouter.delete(
  '/:storyId',
  isValidId('storyId'),
  ctrlWrapper(deleteStoryByIdController),
);

export default storiesRouter;