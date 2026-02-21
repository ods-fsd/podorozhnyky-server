import createHttpError from "http-errors";
import {
    getAllStories,
    getStoryByIdService,
    createStory,
    updateStory,
    deleteStoryByIdService,
    toggleFavoriteService,
    getSavedStories,
} from "../services/stories.js";
import {
    parsePaginationParams
} from "../utils/parsePaginationParams.js";

// 1. ОТРИМАННЯ ВСІХ ІСТОРІЙ (Головна)
export const getStoriesController = async (req, res) => {
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);
    const {
        category
    } = req.query;

    const data = await getAllStories({
        page,
        perPage,
        filter: {
            category
        },
    });

    res
        .status(200)
        .json({
            status: 200,
            message: "Successfully found stories!",
            data
        });
};

// 2. ТВОЇ ВЛАСНІ ІСТОРІЇ (Сторінка "Мої історії")
export const getOwnStoriesController = async (req, res) => {
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);

    const data = await getAllStories({
        page,
        perPage,
        filter: {
            ownerId: req.user._id
        }, // Фільтр тільки для твоїх постів
    });

    res
        .status(200)
        .json({
            status: 200,
            message: "Successfully found your stories!",
            data
        });
};

// 3. ЗБЕРЕЖЕНІ ІСТОРІЇ (Сторінка "Збережене")
export const getSavedStoriesController = async (req, res) => {
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);

    const data = await getSavedStories(req.user._id, page, perPage);

    res
        .status(200)
        .json({
            status: 200,
            message: "Successfully found saved stories!",
            data
        });
};

// 4. КНОПКА-СЕРДЕЧКО (Додати/Видалити з обраного)
export const toggleFavoriteController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const result = await toggleFavoriteService(storyId, req.user._id);

    res.json({
        status: 200,
        message: result.isFavorite ?
            "Added to favorites" :
            "Removed from favorites",
        data: result,
    });
};

// 5. ОДНА ІСТОРІЯ
export const getStoryByIdController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const story = await getStoryByIdService(storyId);

    if (!story) throw createHttpError(404, "Story not found");

    res.json({
        status: 200,
        message: "Successfully found story!",
        data: story
    });
};

// 6. СТВОРЕННЯ ІСТОРІЇ
export const createStoryController = async (req, res) => {
    if (!req.file) throw createHttpError(400, "Story image is required");

    const storyData = {
        ...req.body,
        ownerId: req.user._id
    };
    const data = await createStory(storyData, req.file);

    res
        .status(201)
        .json({
            status: 201,
            message: "Story created successfully",
            data
        });
};

// 7. ОНОВЛЕННЯ ТА ВИДАЛЕННЯ
export const updateStoryController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const result = await updateStory(storyId, req.user._id, req.body);

    if (!result) throw createHttpError(404, "Story not found or access denied");

    res.json({
        status: 200,
        message: "Story updated successfully!",
        data: result.story,
    });
};

export const deleteStoryByIdController = async (req, res) => {
    const {
        storyId
    } = req.params;
    await deleteStoryByIdService(storyId, req.user._id);

    res.status(204).send();
};