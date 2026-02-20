import { getUserCurrentService } from "../services/users.js";
import { getAllUsersService } from "../services/users.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";

export const getCurrentUserController = async (req, res, next) => {
  const { page, perPage } = req.paginationParams;

  const userId = req.user._id;

  const { user, totalFavoritesCount } = await getUserCurrentService(userId, {
    page,
    perPage,
  });

  const pagination = calculatePaginationData(
    totalFavoritesCount,
    perPage,
    page
  );

  res.status(200).json({
    status: 200,
    message: "Current user data retrieved successfully.",
    data: {
      user,
      pagination,
    },
  });
};
export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const result = await getAllUsersService({
    page,
    perPage,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully found users!",
    data: result,
  });
};
