// src/routers/index.js
import { Router } from 'express';
// Тимчасово коментуємо роути, файли яких ще не створені, щоб уникнути помилок запуску
// import authRouter from './auth.js';
// import usersRouter from './users.js';
import storiesRouter from './stories.js';
// import categoriesRouter from './categories.js';

const router = Router();

/**
 * Головний роутер додатку.
 * Тут ми збираємо всі окремі блоки маршрутів в єдину структуру.
 */

// router.use('/auth', authRouter);
// router.use('/users', usersRouter);

router.use('/stories', storiesRouter);

// router.use('/categories', categoriesRouter);

export default router;