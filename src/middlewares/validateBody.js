import createHttpError from 'http-errors';

/**
 * Мідлвара для валідації тіла запиту (req.body).
 * Вона приймає Joi-схему і перевіряє дані, які надіслав користувач.
 * @param {Object} schema - Joi схема для валідації
 */
export const validateBody = (schema) => async (req, res, next) => {
    try {
        // Виконуємо валідацію. abortEarly: false дозволяє побачити всі помилки відразу, а не тільки першу.
        await schema.validateAsync(req.body, {
            abortEarly: false,
        });
        // Якщо дані валідні — йдемо далі
        next();
    } catch (err) {
        // Якщо дані невірні — формуємо помилку 400 (Bad Request)
        const error = createHttpError(400, 'Bad Request', {
            errors: err.details,
        });
        next(error);
    }
};