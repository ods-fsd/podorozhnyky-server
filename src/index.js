<<<<<<< HEAD
import dotenv from 'dotenv';
import { initMongoDBConnection } from './db/initMongoDBConnection.js';
import express from 'express';
import cors from 'cors';

import usersRouter from './routers/users.js';
import storiesRouter from './routers/stories.js';
=======
// src/index.js
>>>>>>> main

import { setupServer } from './server.js';
// Використовуємо твою назву файлу з 'DB'
import { initMongoDBConnection } from './db/initMongoDBConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

<<<<<<< HEAD
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/stories', storiesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// централізована помилка (під ctrlWrapper/service errors)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const startServer = async () => {
  await initMongoDBConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
=======
/**
 * Головна функція запуску (bootstrap).
 * Вона готує середовище перед тим, як сервер почне приймати запити.
 */
const bootstrap = async () => {
  // 1. Чекаємо на успішне підключення до бази даних
  await initMongoDBConnection();
  
  // 2. Створюємо папку для тимчасових файлів (temp), якщо її немає
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  
  // 3. Створюємо папку для постійних файлів (uploads), якщо її немає
  await createDirIfNotExists(UPLOAD_DIR);
  
  // 4. Запускаємо основний Express-сервер із файлу server.js
  setupServer();
>>>>>>> main
};

// Запускаємо весь процес
void bootstrap();