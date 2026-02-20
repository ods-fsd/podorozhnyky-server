import { StoriesCollection } from "../db/models/story.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js"; // Проверь путь к файлу

export const getOwnStoriesController = async (req, res) => {
  const { _id: userId } = req.user; // Получаем ID из мидлвара authenticate

  // Используем твою функцию для извлечения page и perPage
  const { page, perPage } = parsePaginationParams(req.query);

  const skip = (page - 1) * perPage;

  // Запрос в базу: только свои истории + пагинация
  const storiesQuery = StoriesCollection.find({ ownerId: userId });

  const [stories, totalItems] = await Promise.all([
    storiesQuery.skip(skip).limit(perPage).sort({ createdAt: -1 }).exec(),
    StoriesCollection.countDocuments({ ownerId: userId }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.json({
    status: 200,
    message: "Successfully found your stories!",
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
