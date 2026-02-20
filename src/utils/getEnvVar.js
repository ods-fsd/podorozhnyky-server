import dotenv from 'dotenv';

// Завантажуємо змінні з .env файлу в process.env
dotenv.config();

/**
 * Функція для отримання значення змінної середовища
 * @param {string} name - Назва змінної
 * @param {string} defaultValue - Значення за замовчуванням
 */
export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  // Якщо змінна знайдена — повертаємо її
  if (value) return value;

  // Якщо не знайдена, але є значення за замовчуванням — повертаємо його
  if (defaultValue) return defaultValue;

  // Якщо змінної немає і немає дефолту — кидаємо помилку
  throw new Error(`Missing: process.env['${name}'].`);
}