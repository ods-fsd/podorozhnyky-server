// errorHandler.js
import { HttpError } from 'http-errors';

// Глобальний перехоплювач усіх помилок у додатку
export const errorHandler = (err, req, res, next) => {
  // Перевіряємо, чи це помилка від бібліотеки http-errors
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  // Якщо помилка невідома — повертаємо 500 статус
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: err.message,
  });
};

// notFoundHandler.js
import createHttpError from 'http-errors';

// Викликається, якщо запит прийшов на шлях, якого не існує
export const notFoundHandler = (req, res, next) => {
  const err = createHttpError(404, 'Route not found');
  res.status(err.status).json({
    status: err.status,
    message: err.name,
    data: err,
  });
};