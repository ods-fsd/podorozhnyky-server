import createHttpError from 'http-errors';
import { StoriesCollection } from '../db/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

/**
 * ОТРИМАННЯ ВСІХ ІСТОРІЙ (Публічний ендпоінт)
 * Реалізує пагінацію, фільтрацію за категоріями та підтягування даних (populate)
 */
export const getAllStories = async ({
  page = 1,
  perPage = 10,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  // Створюємо базовий запит до колекції
  const storiesQuery = StoriesCollection.find();

  // Додаємо фільтрацію за категорією, якщо вона передана в query-параметрах
  if (filter.category) {
    storiesQuery.where('category').equals(filter.category);
  }

  // Виконуємо два запити паралельно: підрахунок загальної кількості та отримання даних
  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery
      .sort({ favoriteCount: -1, _id: -1 }) // Сортування за популярністю та новизною
      .skip(skip)
      .limit(limit)
      .populate({ path: 'ownerId', select: 'name avatarUrl' }) // Дані автора
      .populate({ path: 'category', select: 'name' }) // Назва категорії
      .exec(),
  ]);

  // Розраховуємо дані пагінації (totalPages, hasNextPage тощо)
  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};

/**
 * ОТРИМАННЯ ОДНІЄЇ ІСТОРІЇ
 */
export const getStoryByIdService = async (storyId) => {
  const story = await StoriesCollection.findById(storyId)
    .populate({ path: 'ownerId', select: 'name avatarUrl' })
    .populate({ path: 'category', select: 'name' })
    .lean();

  return story;
};

/**
 * СТВОРЕННЯ ІСТОРІЇ 
 */
export const createStory = async (storyData, file) => {
  const imgUrl = await saveFileToCloudinary(file);

  const newStoryData = {
    ...storyData,
    img: imgUrl,
  };

  return await StoriesCollection.create(newStoryData);
};

/**
 * ОНОВЛЕННЯ ІСТОРІЇ 
 */
export const updateStory = async (storyId, ownerId, payload) => {
  const result = await StoriesCollection.findOneAndUpdate(
    { _id: storyId, ownerId }, // Оновлюємо тільки якщо користувач — власник
    payload,
    { new: true }
  );

  return result ? { story: result } : null;
};

/**
 * ВИДАЛЕННЯ ІСТОРІЇ 
 */
export const deleteStoryByIdService = async (storyId, userId) => {
  const story = await StoriesCollection.findOneAndDelete({ 
    _id: storyId, 
    ownerId: userId 
  });

  if (!story) {
    throw createHttpError(404, 'Story not found or access denied');
  }

  return {
    message: 'Story deleted successfully',
    story,
  };
};