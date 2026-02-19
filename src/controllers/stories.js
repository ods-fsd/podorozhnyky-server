import { updateStoryService } from '../services/stories.js';

export const updateStoryController = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const updatedStory = await updateStoryService({
    storyId,
    userId,
    payload: req.body,
  });

  res.status(200).json({
    data: updatedStory,
  });
};