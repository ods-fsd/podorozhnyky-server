import createHttpError from "http-errors";
import { StoriesCollection } from "../models/story.js";
import { UsersCollection } from "../models/user.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

/**
 * 1. МАНДРІВНИКИ (Список усіх користувачів)
 * Використовуємо для головної сторінки мандрівників
 */
export const getAllUsersService = async ({ page = 1, perPage = 10 }) => {
  const skip = (page - 1) * perPage;

  const [users, total] = await Promise.all([
    UsersCollection.find()
      .select("name avatarUrl description createdAt")
      .skip(skip)
      .limit(perPage)
      .exec(),
    UsersCollection.countDocuments().exec(),
  ]);

  return {
    data: users,
    ...calculatePaginationData(total, perPage, page),
  };
};

/**
 * 2. ПОТОЧНИЙ ЮЗЕР + ЗБЕРЕЖЕНІ (Для вкладки "Збережене" в профілі)
 */
export const getUserCurrentService = async (userId, { page, perPage }) => {
  const skip = (page - 1) * perPage;
  const user = await UsersCollection.findById(userId).select(
    "favorites name email avatarUrl description",
  );

  if (!user) throw createHttpError(404, "User not found");

  const totalFavoritesCount = user.favorites.length;
  const paginatedFavoriteIds = user.favorites.slice(skip, skip + perPage);

  const paginatedFavorites = await StoriesCollection.find({
    _id: { $in: paginatedFavoriteIds },
  }).populate([
    { path: "ownerId", select: "name avatarUrl" },
    { path: "category", select: "name" },
  ]);

  const userObject = user.toObject();
  delete userObject.favorites;

  return {
    user: { ...userObject, favorites: paginatedFavorites },
    totalFavoritesCount,
  };
};

/**
 * 3. ПОТОЧНИЙ ЮЗЕР + ВЛАСНІ ІСТОРІЇ (Для вкладки "Мої історії")
 */
export const getUserCurrentStoriesService = async (
  userId,
  { page, perPage },
) => {
  const skip = (page - 1) * perPage;
  const filter = { ownerId: userId };

  const [totalItems, stories, user] = await Promise.all([
    StoriesCollection.countDocuments(filter),
    StoriesCollection.find(filter)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate({ path: "category", select: "name" }),
    UsersCollection.findById(userId).select("-favorites"),
  ]);

  return {
    user: { ...user.toObject(), stories },
    totalItems,
  };
};

/**
 * 4. ПУБЛІЧНИЙ ПРОФІЛЬ МАНДРІВНИКА (Коли заходимо до когось іншого)
 */
export const getUserByIdService = async (
  userId,
  { page = 1, perPage = 10 },
) => {
  const user = await UsersCollection.findById(userId)
    .select("name avatarUrl description createdAt")
    .lean();

  if (!user) return null;

  const filter = { ownerId: userId };
  const [stories, total] = await Promise.all([
    StoriesCollection.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({ path: "category", select: "name" })
      .lean(),
    StoriesCollection.countDocuments(filter),
  ]);

  return {
    user,
    stories: {
      data: stories,
      ...calculatePaginationData(total, perPage, page),
    },
  };
};

/**
 * 5. ОНОВЛЕННЯ ПРОФІЛЮ (Редагування аватарки, імені тощо)
 */
export const updateUserCurrentService = async (userId, updateData) => {
  return await UsersCollection.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-favorites");
};

export const addFavorite = async (userId, storyId) => {
  const story = await StoriesCollection.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (user.favorites.includes(storyId)) {
    throw createHttpError(409, 'Story already in favorites');
  }

  user.favorites.push(storyId);
  await user.save();

  story.favoriteCount += 1;
  await story.save();

  return user.favorites;
};