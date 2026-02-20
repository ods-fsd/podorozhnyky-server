// src/index.js

import { setupServer } from './server.js';
// Використовуємо твою назву файлу з 'DB'
import { initMongoDBConnection } from './db/initMongoDBConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

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
};

// Запускаємо весь процес
void bootstrap();