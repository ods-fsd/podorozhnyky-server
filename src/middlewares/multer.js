import multer from 'multer';
import createHttpError from 'http-errors';
import {
    TEMP_UPLOAD_DIR
} from '../constants/index.js';

// Налаштовуємо тимчасове сховище для завантажених файлів
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Файли спочатку потрапляють у папку temp
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function(req, file, cb) {
        // Створюємо унікальне ім'я файлу: поточна дата + оригінальна назва
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

// Фільтр для перевірки типу файлу (дозволяємо лише зображення)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(createHttpError(400, 'Завантажений файл не є зображенням!'), false);
    }
};

/**
 * Експортуємо налаштований multer.
 * У роутері stories.js ми використовуємо його як upload.single('storyImage')
 */
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Обмеження розміру: 5MB
    },
});