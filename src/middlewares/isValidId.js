import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

/**
 * Мідлвара для валідації MongoDB ObjectId.
 * Перевіряє, чи є переданий ID коректним для бази даних.
 * @param {string} idName - Назва параметра в URL (наприклад, 'storyId')
 */
export const isValidId = (idName = 'id') => {
  return (req, res, next) => {
    // Отримуємо значення ID з параметрів запиту
    const id = req.params[idName];

    // Якщо ID не існує — кидаємо 400 помилку
    if (!id) {
      throw createHttpError(400, 'Bad Request: ID is missing');
    }

    // Використовуємо метод mongoose для перевірки формату ID
    if (!isValidObjectId(id)) {
      // Якщо формат неправильний — кидаємо 400 помилку
      return next(createHttpError(400, `${id} is not valid id`));
    }

    // Якщо все добре — йдемо далі до контролера
    next();
  };
};