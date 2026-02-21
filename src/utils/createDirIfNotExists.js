import fs from 'node:fs/promises';

/**
 * Утиліта для перевірки наявності папки та її створення у разі відсутності.
 * Використовується в index.js для підготовки середовища перед запуском сервера.
 * @param {string} url - Шлях до папки (наприклад, 'uploads' або 'temp')
 */
export const createDirIfNotExists = async (url) => {
  try {
    // Намагаємося отримати доступ до папки (перевірити, чи вона існує)
    await fs.access(url);
  } catch (err) {
    // Якщо помилка 'ENOENT', це означає, що папки не існує
    if (err.code === 'ENOENT') {
      // Створюємо папку
      await fs.mkdir(url);
    }
  }
};