import { CategoriesCollection } from '../db/models/category.js';

/**
 * Перетворює назву категорії на її ID з бази даних.
 * @param {string} category - Назва категорії (наприклад, 'Lifestyle')
 */
const parseCategory = async (category) => {
  if (typeof category !== 'string') return undefined;

  // Шукаємо категорію в колекції за назвою
  const foundCategory = await CategoriesCollection.findOne({ name: category });

  return foundCategory ? foundCategory._id : undefined;
};

export const parseFilterParams = async (query) => {
  const { category } = query;

  const parsedCategory = await parseCategory(category);

  return {
    // Додаємо категорію в об'єкт фільтрації тільки якщо вона знайдена
    ...(parsedCategory !== undefined && { category: parsedCategory }),
  };
};