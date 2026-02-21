import {
  registerController,
  loginController,
  getUsersController,
  getCurrentUserController,
  getCurrentUserStoriesController,
  getUserByIdController,
  updateCurrentUserController,
  updateAvatarController,
} from "../controllers/users.js";

import {
    authenticate
} from "../middlewares/authenticate.js";
import {
    isValidId
} from "../middlewares/isValidId.js";
import {
    upload
} from "../middlewares/multer.js";
import {
    validateBody
} from "../middlewares/validateBody.js";
import {
    ctrlWrapper
} from "../utils/ctrlWrapper.js";
import {
    registerSchema,
    loginSchema
} from "../validation/auth.js";
import {
    updateUserSchema
} from "../validation/users.js";

const usersRouter = Router();

// --- АВТОРИЗАЦІЯ (Публічні) ---
usersRouter.post(
    "/register",
    validateBody(registerSchema),
    ctrlWrapper(registerController),
);
usersRouter.post(
    "/login",
    validateBody(loginSchema),
    ctrlWrapper(loginController),
);

// --- МАНДРІВНИКИ (Публічні) ---
// Отримати всіх користувачів (для сторінки Travelers)
usersRouter.get("/", ctrlWrapper(getUsersController));

// --- ПРОФІЛЬ (Приватні - потрібен токен) ---
usersRouter.use(authenticate);
usersRouter.patch(
  "/avatar",
  upload.single("avatar"),
  ctrlWrapper(updateAvatarController),
);


// 1. Мої збережені (Вкладка "Saved")
usersRouter.get("/current", ctrlWrapper(getCurrentUserController));

// 2. Мої власні історії (Вкладка "My Stories")
usersRouter.get(
    "/current/stories",
    ctrlWrapper(getCurrentUserStoriesController),
);

// 3. Редагування профілю (Ім'я, опис, аватар)
usersRouter.patch(
    "/current",
    upload.single("avatar"),
    validateBody(updateUserSchema),
    ctrlWrapper(updateCurrentUserController),
);

// --- ПУБЛІЧНИЙ ПРОФІЛЬ (За ID) ---
// Має бути в самому кінці!
usersRouter.get(
    "/:userId",
    isValidId("userId"),
    ctrlWrapper(getUserByIdController),
);

export default usersRouter;