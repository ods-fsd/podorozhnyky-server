import {
    StoriesCollection
} from '../models/story.js';
import {
    parsePaginationParams
} from '../utils/parsePaginationParams.js';
import {
    saveFileToCloudinary
} from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

// GET /stories  — public, all stories
export const getStoriesController = async (req, res) => {
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);
    const skip = (page - 1) * perPage;

    const [stories, totalItems] = await Promise.all([
        StoriesCollection.find()
        .skip(skip)
        .limit(perPage)
        .sort({
            createdAt: -1
        })
        .exec(),
        StoriesCollection.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.json({
        status: 200,
        message: 'Successfully found stories!',
        data: {
            data: stories,
            page,
            perPage,
            totalItems,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
        },
    });
};

// GET /stories/:storyId  — public, single story
export const getStoryByIdController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const story = await StoriesCollection.findById(storyId);

    if (!story) {
        throw createHttpError(404, 'Story not found');
    }

    res.json({
        status: 200,
        message: 'Successfully found story!',
        data: story,
    });
};

// POST /stories  — private
export const createStoryController = async (req, res) => {
    const {
        _id: ownerId
    } = req.user;

    let img;
    if (req.file) {
        img = await saveFileToCloudinary(req.file);
    } else {
        throw createHttpError(400, 'Story image is required');
    }

    const story = await StoriesCollection.create({
        ...req.body,
        img,
        ownerId,
    });

    res.status(201).json({
        status: 201,
        message: 'Story created successfully!',
        data: story,
    });
};

// PATCH /stories/:storyId  — private, owner only
export const updateStoryController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const {
        _id: userId
    } = req.user;

    const story = await StoriesCollection.findOne({
        _id: storyId,
        ownerId: userId
    });

    if (!story) {
        throw createHttpError(404, 'Story not found or access denied');
    }

    const update = {
        ...req.body
    };

    if (req.file) {
        update.img = await saveFileToCloudinary(req.file);
    }

    const updatedStory = await StoriesCollection.findByIdAndUpdate(storyId, update, {
        new: true,
    });

    res.json({
        status: 200,
        message: 'Story updated successfully!',
        data: updatedStory,
    });
};

// DELETE /stories/:storyId  — private, owner only
export const deleteStoryByIdController = async (req, res) => {
    const {
        storyId
    } = req.params;
    const {
        _id: userId
    } = req.user;

    const story = await StoriesCollection.findOneAndDelete({
        _id: storyId,
        ownerId: userId,
    });

    if (!story) {
        throw createHttpError(404, 'Story not found or access denied');
    }

    res.status(204).send();
};

// GET /stories/own  — private, own stories (kept for potential separate route)
export const getOwnStoriesController = async (req, res) => {
    const {
        _id: userId
    } = req.user;
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);
    const skip = (page - 1) * perPage;

    const [stories, totalItems] = await Promise.all([
        StoriesCollection.find({
            ownerId: userId
        })
        .skip(skip)
        .limit(perPage)
        .sort({
            createdAt: -1
        })
        .exec(),
        StoriesCollection.countDocuments({
            ownerId: userId
        }),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.json({
        status: 200,
        message: 'Successfully found your stories!',
        data: {
            data: stories,
            page,
            perPage,
            totalItems,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
        },
    });
};