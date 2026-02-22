import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  getAllUsersService,
  getUserCurrentService,
  getUserCurrentStoriesService,
  getUserByIdService,
  updateUserCurrentService,
  addFavorite,
} from "../services/users.js";

import { UsersCollection } from "../models/user.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";

// --- АВТОРИЗАЦІЯ (з Мейну) ---

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await UsersCollection.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: 201,
    message: "Successfully registered!",
    data: { user: { name: newUser.name, email: newUser.email } },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersCollection.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, "Invalid credentials");
  }

  const secret = getEnvVar("JWT_SECRET");
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: "24h" });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in!",
    data: { token, user: { name: user.name, email: user.email } },
  });
};

// --- ТВОЄ ТЗ: МАНДРІВНИКИ ТА ПРОФІЛЬ ---

// 1. Всі мандрівники (Сторінка "Travelers")
export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const data = await getAllUsersService({ page, perPage });

  res.status(200).json({
    status: 200,
    message: "Successfully found users!",
    data,
  });
};

// 2. Дані поточного юзера + Збережені історії (Вкладка "Saved")
export const getCurrentUserController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const userId = req.user._id;

  const { user, totalFavoritesCount } = await getUserCurrentService(userId, {
    page,
    perPage,
  });
  const pagination = calculatePaginationData(
    totalFavoritesCount,
    perPage,
    page,
  );

  res.status(200).json({
    status: 200,
    message: "Current user data retrieved successfully.",
    data: { user, pagination },
  });
};

// 3. Тільки власні історії поточного юзера (Вкладка "My Stories")
export const getCurrentUserStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const userId = req.user._id;

  const { user, totalItems } = await getUserCurrentStoriesService(userId, {
    page,
    perPage,
  });
  const pagination = calculatePaginationData(totalItems, perPage, page);

  res.status(200).json({
    status: 200,
    message:
      totalItems === 0
        ? "You haven't created any stories yet."
        : "Stories retrieved successfully.",
    data: { user, pagination },
  });
};

// 4. Публічний профіль іншого мандрівника
export const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  const { page, perPage } = parsePaginationParams(req.query);

  const result = await getUserByIdService(userId, { page, perPage });
  if (!result) throw createHttpError(404, "User not found");

  res.status(200).json({
    status: 200,
    message: "Successfully found user!",
    data: result,
  });
};

// 5. Редагування профілю (Аватарка, ім'я, опис)
export const updateCurrentUserController = async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;
  let avatarUrl;

  if (req.file) {
    avatarUrl = await saveFileToCloudinary(req.file);
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (avatarUrl) updateData.avatarUrl = avatarUrl;

  const updatedUser = await updateUserCurrentService(userId, updateData);

  res.status(200).json({
    status: 200,
    message: "User profile updated successfully",
    data: updatedUser,
  });
};

export const updateAvatarController = async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    throw createHttpError(400, "Avatar file is required");
  }

  const avatarUrl = await saveFileToCloudinary(req.file);

  const updatedUser = await updateUserCurrentService(userId, {
    avatarUrl,
  });

  res.status(200).json({
    status: 200,
    message: "Avatar updated successfully",
    data: updatedUser,
  });
};

export const addFavoriteController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const favorites = await addFavorite(userId, storyId);

  res.status(200).json({
    status: 200,
    message: "Story added to favorites successfully",
    data: { favorites },
  });
};