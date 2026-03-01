import {
    Router
} from "express";
import {
    getUsersController,
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
    updateUserSchema,
} from "../validation/users.js";

const usersRouter = Router();

// --- МАНДРІВНИКИ (Публічні) ---
// Отримати всіх користувачів (для сторінки Travelers)
usersRouter.get("/", ctrlWrapper(getUsersController));

// --- ПУБЛІЧНИЙ ПРОФІЛЬ (За ID) ---
usersRouter.get(
    "/:userId",
    isValidId("userId"),
    ctrlWrapper(getUserByIdController),
);

// --- ПРОФІЛЬ (Приватні - потрібен токен) ---
usersRouter.use(authenticate);
usersRouter.patch(
    "/avatar",
    upload.single("avatar"),
    ctrlWrapper(updateAvatarController),
);

// 3. Редагування профілю (Ім'я, опис, аватар)
usersRouter.patch(
    "/current",
    upload.single("avatar"),
    validateBody(updateUserSchema),
    ctrlWrapper(updateCurrentUserController),
);



export default usersRouter;