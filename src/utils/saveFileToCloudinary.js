import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

// Налаштовуємо конфігурацію Cloudinary, використовуючи твої змінні з .env
cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

/**
 * Функція для завантаження файлу в Cloudinary.
 * Після успішного завантаження видаляє тимчасовий файл із сервера.
 * @param {Object} file - Файл, отриманий через multer
 */
export const saveFileToCloudinary = async (file) => {
  try {
    // Завантажуємо файл у Cloudinary
    const response = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'stories', // Назва папки в хмарі Cloudinary
    });

    // Видаляємо тимчасовий файл із нашої папки temp після завантаження
    await fs.unlink(file.path);

    // Повертаємо посилання на завантажене зображення
    return response.secure_url;
  } catch (error) {
    // Якщо сталася помилка, все одно намагаємося видалити файл, щоб не засмічувати сервер
    await fs.unlink(file.path);
    throw error;
  }
};