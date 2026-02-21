import {
    UsersCollection
} from "../models/user.js";
import {
    StoriesCollection
} from "../models/story.js";
import {
    calculatePaginationData
} from "../utils/calculatePaginationData.js";

import createHttpError from "http-errors";

export const getUserCurrentService = async (userId, {
    page,
    perPage
}) => {
    const skip = (page - 1) * perPage;

    const user = await UsersCollection.findOne({
        _id: userId
    }).select(
        "favorites name email avatarUrl description"
    );

    if (!user) {
        return {
            user: null,
            totalFavoritesCount: 0
        };
    }

    const totalFavoritesCount = user.favorites.length;

    const paginatedFavoriteIds = user.favorites.slice(skip, skip + perPage);

    const paginatedFavorites = await StoriesCollection.find({
        _id: {
            $in: paginatedFavoriteIds
        },
    }).populate([{
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

    return {
        user: finalUser,
        totalFavoritesCount
    };
};

export const getAllUsersService = async ({
    page,
    perPage
}) => {
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

export const getUserByIdService = async (userId, {
    page,
    perPage
}) => {
    const skip = (page - 1) * perPage;

    const user = await UsersCollection.findById(userId).select("name avatarUrl description email");

    if (!user) {
        return null;
    }

    const [storiesCount, paginatedStories] = await Promise.all([
        StoriesCollection.countDocuments({
            ownerId: userId
        }),
        StoriesCollection.find({
            ownerId: userId
        })
        .skip(skip)
        .limit(perPage)
        .sort({
            createdAt: -1
        })
        .populate([{
            path: "category",
            select: "_id name"
        }])
        .exec()
    ]);

    const paginationData = calculatePaginationData(storiesCount, perPage, page);

    return {
        user,
        stories: {
            data: paginatedStories,
            ...paginationData
        }
    };
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