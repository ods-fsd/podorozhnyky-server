<<<<<<< HEAD
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
=======
import { Router } from "express";
import {
  createStoryController,
  deleteStoryByIdController,
  getStoriesController,
  getStoryByIdController,
  updateStoryController,
  getSavedStoriesController,
  getOwnStoriesController,
  toggleFavoriteController,
} from "../controllers/stories.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isValidId } from "../middlewares/isValidId.js";
import { upload } from "../middlewares/multer.js";
import { validateBody } from "../middlewares/validateBody.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createStorySchema, updateStorySchema } from "../validation/stories.js";

const storiesRouter = Router();

// --- ПУБЛІЧНІ РОУТИ ---

// 1. Всі історії (Головна сторінка)
storiesRouter.get("/", ctrlWrapper(getStoriesController));

// 2. Деталі однієї історії
storiesRouter.get(
  "/:storyId",
  isValidId("storyId"),
  ctrlWrapper(getStoryByIdController),
);

// --- ПРИВАТНІ РОУТИ (Потрібна авторизація) ---
storiesRouter.use(authenticate);

// 3. Твої власні історії (Сторінка "Мої історії")
// Має стояти ПЕРЕД /:storyId, щоб Express не переплутав 'own' з ID
storiesRouter.get("/own", ctrlWrapper(getOwnStoriesController));

// 4. Твої збережені історії (Сторінка "Збережене")
storiesRouter.get("/saved", ctrlWrapper(getSavedStoriesController));

// 5. Кнопка-сердечко (Додати/Видалити з обраного)
storiesRouter.post(
  "/:storyId/favorite",
  isValidId("storyId"),
  ctrlWrapper(toggleFavoriteController),
);

// 6. Створення нової історії
storiesRouter.post(
  "",
  upload.single("storyImage"),
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

// 7. Редагування (Тільки власник)
storiesRouter.patch(
  "/:storyId",
  isValidId("storyId"),
  upload.single("storyImage"),
>>>>>>> main
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

<<<<<<< HEAD
export default storiesRouter;
=======
// 8. Видалення (Тільки власник)
storiesRouter.delete(
  "/:storyId",
  isValidId("storyId"),
  ctrlWrapper(deleteStoryByIdController),
);

export default storiesRouter;
>>>>>>> main
