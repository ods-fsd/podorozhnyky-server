import createHttpError from "http-errors";
import { StoriesCollection } from "../models/story.js";
import { UsersCollection } from "../models/user.js"; // Виправив назву моделі
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

/**
 * 1. ОТРИМАННЯ ІСТОРІЙ (Універсальний: Всі або Мої)
 */
export const getAllStories = async ({
  page = 1,
  perPage = 10,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find();

  // Фільтр за категорією
  if (filter.category) {
    storiesQuery.where("category").equals(filter.category);
  }

  // ФІЧА ДЛЯ ТЗ: Фільтр за власником (для сторінки "Мої історії")
  if (filter.ownerId) {
    storiesQuery.where("ownerId").equals(filter.ownerId);
  }

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery
      .sort({ createdAt: -1 }) // Сортуємо: нові зверху
      .skip(skip)
      .limit(limit)
      .populate({ path: "ownerId", select: "name avatarUrl" })
      .populate({ path: "category", select: "name" })
      .exec(),
  ]);

  return {
    data: stories,
    ...calculatePaginationData(storiesCount, perPage, page),
  };
};

/**
 * 2. ТВОЄ ТЗ: ЗБЕРЕЖЕНІ ІСТОРІЇ (Отримання списку)
 */
export const getSavedStories = async (userId, page = 1, perPage = 10) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, "User not found");

  // Використовуємо 'favorites', як ми домовлялися для бази
  const favoritesIds = user.favorites || [];

  if (favoritesIds.length === 0) {
    return { data: [], ...calculatePaginationData(0, perPage, page) };
  }

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.countDocuments({ _id: { $in: favoritesIds } }),
    StoriesCollection.find({ _id: { $in: favoritesIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({ path: "ownerId", select: "name avatarUrl" })
      .populate({ path: "category", select: "name" })
      .exec(),
  ]);

  return {
    data: stories,
    ...calculatePaginationData(storiesCount, perPage, page),
  };
};

/**
 * 3. ТВОЄ ТЗ: ЛОГІКА "СЕРДЕЧКА" (Додати/Видалити з обраного)
 */
export const toggleFavoriteService = async (storyId, userId) => {
  const user = await UsersCollection.findById(userId);
  if (!user) throw createHttpError(404, "User not found");

  const isFavorite = user.favorites.includes(storyId);

  if (isFavorite) {
    await UsersCollection.findByIdAndUpdate(userId, {
      $pull: { favorites: storyId },
    });
  } else {
    await UsersCollection.findByIdAndUpdate(userId, {
      $addToSet: { favorites: storyId },
    });
  }

  return { isFavorite: !isFavorite };
};

/**
 * СТАНДАРТНІ ОПЕРАЦІЇ (Отримання за ID, Створення, Оновлення, Видалення)
 */
export const getStoryByIdService = async (storyId) => {
  return await StoriesCollection.findById(storyId)
    .populate({ path: "ownerId", select: "name avatarUrl" })
    .populate({ path: "category", select: "name" })
    .lean();
};

export const createStory = async (storyData, file) => {
  const img = file ? await saveFileToCloudinary(file) : "";
  return await StoriesCollection.create({ ...storyData, img });
};

export const updateStory = async (storyId, ownerId, payload) => {
  const result = await StoriesCollection.findOneAndUpdate(
    { _id: storyId, ownerId },
    payload,
    { new: true },
  );
  return result ? { story: result } : null;
};

export const deleteStoryByIdService = async (storyId, userId) => {
  const story = await StoriesCollection.findOneAndDelete({
    _id: storyId,
    ownerId: userId,
  });
  if (!story) throw createHttpError(404, "Story not found or access denied");
  return { story };
};
