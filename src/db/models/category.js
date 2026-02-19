import { model, Schema } from 'mongoose';

/**
 * Схема категорій для історій.
 * Допомагає групувати подорожі за типом.
 */
const categoriesSchema = new Schema(
  {
    // Назва категорії (наприклад, 'Nature', 'Adventure', 'Food')
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // Опис (опціонально)
    description: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true, // Додає поля createdAt та updatedAt
  },
);

// Створюємо та експортуємо модель
export const CategoriesCollection = model('categories', categoriesSchema);