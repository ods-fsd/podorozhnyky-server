import mongoose from 'mongoose';
import { StoriesCollection } from '../db/models/story.js';

export const updateStoryService = async ({ storyId, userId, payload }) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    const error = new Error('Invalid storyId');
    error.status = 400;
    throw error;
  }

  const story = await StoriesCollection.findById(storyId);

  if (!story) {
    const error = new Error('Story not found');
    error.status = 404;
    throw error;
  }

  if (String(story.ownerId) !== String(userId)) {
    const error = new Error('Access denied');
    error.status = 403;
    throw error;
  }

  const updatedStory = await StoriesCollection.findByIdAndUpdate(storyId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedStory;
};