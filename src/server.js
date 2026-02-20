// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js'; // Твій головний роутер із /stories
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import usersRouter from './routers/users.js';

// Отримуємо порт із .env (або 3000)
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // Дозволяємо зчитувати JSON у тілі запиту (req.body)
  app.use(express.json());
  
  // Налаштування CORS для зв'язку з фронтендом
  app.use(
    cors({
      origin: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
      credentials: true,
    }),
  );
  
  // Обробка cookies (потрібно для авторизації)
  app.use(cookieParser());
  
  // Відкриваємо доступ до папки з картинками через браузер
  app.use('/uploads', express.static(UPLOAD_DIR));
  
  // Підключаємо документацію Swagger (/api-docs)
  app.use('/api-docs', swaggerDocs());

  // Гарне логування запитів у консолі
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Базовий перевірочний маршрут
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  // Підключаємо роути користувачів
  app.use('/api/users', usersRouter);

  // ПІДКЛЮЧЕННЯ ТВОЇХ ІСТОРІЙ (через основний роутер)
  app.use(router);

  // Якщо шлях не знайдено — викликаємо 404
  app.use(notFoundHandler);

  // Якщо сталася помилка в коді — викликаємо цей обробник
  app.use(errorHandler);

  // Починаємо слухати порт
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};