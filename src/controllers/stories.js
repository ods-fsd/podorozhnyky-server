import createHttpError from 'http-errors';
import {
  createStory,
  deleteStoryByIdService,
  getAllStories,
  getStoryByIdService,
  updateStory,
} from '../services/stories.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// Отримання списку історій з пагінацією та фільтрами 
export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const filter = await parseFilterParams(req.query);

  const stories = await getAllStories({
    page,
    perPage,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Історії успішно знайдено!',
    data: stories,
  });
};

// Отримання однієї історії за її ID
export const getStoryByIdController = async (req, res) => {
  const { storyId } = req.params;
  const story = await getStoryByIdService(storyId);

  if (!story) {
    throw createHttpError(404, 'Історію не знайдено');
  }

  res.status(200).json({
    status: 200,
    message: 'Історію успішно знайдено!',
    data: story,
  });
};

// Створення нової історії (Для команди)
export const createStoryController = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Зображення для історії є обов’язковим');
  }

  const storyData = {
    ...req.body,
    ownerId: req.user._id, // ID береться з мідлвара авторизації (authenticate)
  };

  const newStory = await createStory(storyData, req.file);

  res.status(201).json({
    status: 201,
    message: 'Історію успішно створено',
    data: newStory,
  });
};

// Оновлення існуючої історії
export const updateStoryController = async (req, res) => {
  let img;
  if (req.file) {
    img = await saveFileToCloudinary(req.file);
  }

  const storyData = {
    ...req.body,
    ...(img && { img }),
  };

  const result = await updateStory(req.params.storyId, req.user._id, storyData);

  if (!result) {
    throw createHttpError(404, 'Історію не знайдено або ви не є її власником');
  }

  res.status(200).json({
    status: 200,
    message: 'Історію успішно оновлено!',
    data: result.story,
  });
};

// Видалення історії
export const deleteStoryByIdController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  await deleteStoryByIdService(storyId, userId);

  res.status(200).json({
    status: 200,
    message: 'Історію успішно видалено',
  });
};