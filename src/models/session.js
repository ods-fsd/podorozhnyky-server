import {
    model,
    Schema
} from 'mongoose';

const sessionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    // Токен для оновлення пари токенів
    refreshToken: {
        type: String,
        required: true
    },
    // Дата, до якої дійсний accessToken
    accessTokenValidUntil: {
        type: Date,
        required: true
    },
    // Дата, до якої дійсний refreshToken
    refreshTokenValidUntil: {
        type: Date,
        required: true
    },
}, {
    versionKey: false,
    timestamps: true, // Автоматично додає поля createdAt та updatedAt
}, );

// Створюємо модель на основі схеми для взаємодії з колекцією sessions
export const SessionsCollection = model('sessions', sessionsSchema);