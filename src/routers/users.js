// src/routers/users.js
import { Router } from 'express';

// Створюємо роутер, щоб уникнути помилки "usersRouter is not defined"
const usersRouter = Router();

/**
 * ==========================================
 * ЗОНА КОЛЕГИ (ТИМЧАСОВО ЗАКОМЕНТОВАНО)
 * Усі імпорти та маршрути для користувачів закоментовані, 
 * щоб відсутність його файлів (контролерів, схем) 
 * не блокувала запуск сервера для твоєї гілки (stories).
 * Коли колега повернеться до роботи, він просто розкоментує потрібне.
 * ==========================================
 */

/*
import {
  addFavoriteController,
  getCurrentUserController,
  getUserByIdController,
  getUsersController,
  removeFavoriteController,
  updateCurrentUserController,
  getCurrentUserStoriesController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { parsePagination } from '../middlewares/parsePagination.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  updateUserFavoritesSchema,
  updateUserSchema,
} from '../validation/users.js';

// GET /api/users/me - отримання інформації про поточного користувача з фейворіт
usersRouter.get(
  '/me',
  authenticate,
  parsePagination,
  ctrlWrapper(getCurrentUserController),
);

// GET /api/users/me/stories - отримання інформації про власні сторіси поточного користувача
usersRouter.get(
  '/me/stories',
  authenticate,
  parsePagination,
  ctrlWrapper(getCurrentUserStoriesController),
);

// PATCH /api/users/me - оновлення даних та аватару
usersRouter.patch(
  '/me',
  authenticate,
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateCurrentUserController),
);

// POST /api/users/me/favorites - додавання статті до збережених
usersRouter.post(
  '/me/favorites',
  authenticate,
  validateBody(updateUserFavoritesSchema),
  ctrlWrapper(addFavoriteController),
);

// DELETE /api/users/me/favorites/:storyId - видалення статті зі збережених
usersRouter.delete(
  '/me/favorites/:storyId',
  authenticate,
  isValidId('storyId'),
  ctrlWrapper(removeFavoriteController),
);

// --- Публічні роути ---
// GET /api/users - отримання даних про користувачів(авторів) + пагінація
usersRouter.get('/', ctrlWrapper(getUsersController));

// GET /users/:userId - отримання даних про користувача за ID
usersRouter.get(
  '/:userId',
  isValidId('userId'),
  ctrlWrapper(getUserByIdController),
);
*/

// Експортуємо порожній роутер, щоб server.js міг його підключити без помилок
export default usersRouter;