import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

/**
 * Мідлвар для налаштування та відображення документації Swagger.
 * Зчитує JSON-файл документації та підключає інтерфейс Swagger UI.
 */
export const swaggerDocs = () => {
  try {
    // Намагаємося прочитати файл за шляхом, вказаним у константах
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    
    // Якщо файл знайдено, повертаємо масив мідлварів для обробки запитів на /api-docs
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    // Якщо файл не знайдено або сталася помилка зчитування — повертаємо помилку 500
    return (req, res, next) =>
      next(createHttpError(500, "Не вдалося завантажити документацію swagger"));
  }
};