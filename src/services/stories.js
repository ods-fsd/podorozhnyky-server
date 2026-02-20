import createHttpError from 'http-errors';

import { StoriesCollection } from '../models/story.js';
import { User } from '../models/user.js'; 
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
 * ОТРИМАННЯ ЗБЕРЕЖЕНИХ ІСТОРІЙ КОРИСТУВАЧА (Приватний ендпоінт)
 */
export const getSavedStories = async (userId, page = 1, perPage = 10) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  // 1. Знаходимо користувача, щоб дістати масив його збережених історій
  const user = await User.findById(userId);

  // 2. Якщо користувача фізично немає в БД — викидаємо помилку 404
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // 3. Якщо масиву збережених немає або він порожній — повертаємо правильний порожній результат
  if (!user.savedStories || user.savedStories.length === 0) {
    return {
      data: [],
      ...calculatePaginationData(0, perPage, page),
    };
  }

  // 4. Формуємо запит до колекції Stories: шукаємо ті, чий _id є в масиві user.savedStories
  const query = StoriesCollection.find({ _id: { $in: user.savedStories } });

  // 5. Отримуємо дані з пагінацією та підрахунком
  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.countDocuments({ _id: { $in: user.savedStories } }),
    query
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'ownerId', select: 'name avatarUrl' })
      .populate({ path: 'category', select: 'name' })
      .exec(),
  ]);

  // 6. Розраховуємо пагінацію
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