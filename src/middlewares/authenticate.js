// src/middlewares/authenticate.js
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

// Назва куки, в якій зберігається токен доступу
const ACCESS_COOKIE_NAME = 'accessToken';

/**
 * Мідлвара для перевірки авторизації користувача через куки.
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1. Витягуємо токен із cookies запиту
    const accessToken = req.cookies[ACCESS_COOKIE_NAME];
    
    // Якщо токена немає — користувач не авторизований
    if (!accessToken) {
      throw createHttpError(401, 'Not authorized');
    }

    // 2. Шукаємо сесію в базі даних за цим токеном
    // Метод populate('userId') автоматично підтягне дані користувача з колекції users
    const session = await SessionsCollection.findOne({ accessToken }).populate(
      'userId',
    );

    // Якщо такої сесії не існує в базі
    if (!session) {
      throw createHttpError(401, 'Not authorized');
    }

    // 3. Перевіряємо, чи не закінчився термін дії токена
    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw createHttpError(401, 'Access token expired');
    }

    // 4. Зберігаємо дані користувача в об'єкт запиту (req.user)
    // Тепер у контролерах ми зможемо отримати доступ до нього через req.user
    req.user = session.userId;
    
    // Передаємо керування наступній функції (контролеру)
    next();
  } catch (err) {
    // Якщо сталася помилка — передаємо її далі в errorHandler
    next(err);
  }
};