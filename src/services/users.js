import { UsersCollection } from "../db/models/user.js";
import { StoriesCollection } from "../db/models/story.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

import createHttpError from "http-errors";

export const getUserCurrentService = async (userId, { page, perPage }) => {
  const skip = (page - 1) * perPage;

  const user = await UsersCollection.findOne({ _id: userId }).select(
    "favorites name email avatarUrl description"
  );

  if (!user) {
    return { user: null, totalFavoritesCount: 0 };
  }

  const totalFavoritesCount = user.favorites.length;

  const paginatedFavoriteIds = user.favorites.slice(skip, skip + perPage);

  const paginatedFavorites = await StoriesCollection.find({
    _id: { $in: paginatedFavoriteIds },
  }).populate([
    {
      path: "ownerId",
      select: "name email avatarUrl description",
    },
    {
      path: "category",
      select: "_id name",
    },
  ]);

  const userObject = user.toObject();
  delete userObject.favorites;

  const finalUser = {
    ...userObject,
    favorites: paginatedFavorites,
  };

  return { user: finalUser, totalFavoritesCount };
};

export const getAllUsersService = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersQuery = UsersCollection.find().select(
    "name avatarUrl description"
  );

  const [usersCount, users] = await Promise.all([
    UsersCollection.countDocuments(),
    usersQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return {
    data: users,
    ...paginationData,
  };
};
