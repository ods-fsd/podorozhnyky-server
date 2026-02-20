import path from 'node:path';

// Напрямки сортування
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// Часові інтервали для токенів або сесій
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// Константи для сервісу відправки імейлів Brevo
export const API_BREVO = {
  API_BREVO_KEY: 'API_BREVO_KEY',
  API_BREVO_FROM: 'API_BREVO_FROM',
};

// Шляхи до папок у системі
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Назви ключів для Cloudinary
export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
};

// Шлях до JSON-файлу документації
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');