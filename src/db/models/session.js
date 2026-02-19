import { model, Schema } from 'mongoose';

/**
 * Схема сесії користувача.
 * Зберігає токени доступу та оновлення, а також термін їх дії.
 */
const sessionsSchema = new Schema(
  {
    // Ідентифікатор користувача, якому належить сесія
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    // Токен для доступу до захищених ресурсів
    accessToken: { type: String, required: true },
    // Токен для оновлення пари токенів
    refreshToken: { type: String, required: true },
    // Дата, до якої дійсний accessToken
    accessTokenValidUntil: { type: Date, required: true },
    // Дата, до якої дійсний refreshToken
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
  },
);

// Створюємо модель на основі схеми для взаємодії з колекцією sessions
export const SessionsCollection = model('sessions', sessionsSchema);