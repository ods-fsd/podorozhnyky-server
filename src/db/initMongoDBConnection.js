import mongoose from 'mongoose';

/**
 * Функція для ініціалізації підключення до MongoDB.
 */
export const initMongoDBConnection = async () => {
    try {
        // Отримуємо змінні середовища
        const {
            MONGODB_USER,
            MONGODB_PASSWORD,
            MONGODB_URL,
            MONGODB_DB
        } = process.env;

        // ПРАВКА: Додаємо логін та пароль у рядок підключення (формат MongoDB Atlas)
        // Раніше вони просто витягувалися, але не використовувалися нижче
        const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

        // Намагаємося з'єднатися
        await mongoose.connect(connectionString);
        console.log('✅ Database connection successful');
    } catch (error) {
        // Якщо база не підключилася, виводимо помилку і зупиняємо сервер
        console.error('❌ Database connection error:', error.message);
        process.exit(1);
    }
};