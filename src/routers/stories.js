import {
    Router
} from "express";
import {
    createStoryController,
    deleteStoryByIdController,
    getStoriesController,
    getStoryByIdController,
    updateStoryController,
    getSavedStoriesController,
    getOwnStoriesController,
    toggleFavoriteController,
} from "../controllers/stories.js";
import {
    removeFavoriteController,
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
    createStorySchema,
    updateStorySchema
} from "../validation/stories.js";

const storiesRouter = Router();

// --- ПУБЛІЧНІ РОУТИ ---

// 1. Всі історії (Головна сторінка)
storiesRouter.get("/", ctrlWrapper(getStoriesController));

// 3. Твої власні історії (Сторінка "Мої історії")
// Має стояти ПЕРЕД /:storyId, щоб Express не переплутав 'own' з ID
storiesRouter.get("/own", authenticate, ctrlWrapper(getOwnStoriesController));

// 4. Твої збережені історії (Сторінка "Збережене")
storiesRouter.get("/saved", authenticate, ctrlWrapper(getSavedStoriesController));

// 2. Деталі однієї історії
storiesRouter.get(
    "/:storyId",
    isValidId("storyId"),
    ctrlWrapper(getStoryByIdController),
);

// --- ПРИВАТНІ РОУТИ (Потрібна авторизація) ---
storiesRouter.use(authenticate);

// 5. Кнопка-сердечко (Додати/Видалити з обраного)
storiesRouter.post(
    "/:storyId/favorite",
    isValidId("storyId"),
    ctrlWrapper(toggleFavoriteController),
);

// Видалення з обраного
storiesRouter.delete(
    "/:storyId/favorite",
    isValidId("storyId"),
    ctrlWrapper(removeFavoriteController),
);

// 6. Створення нової історії
storiesRouter.post(
    "",
    upload.single("storyImage"),
    validateBody(createStorySchema),
    ctrlWrapper(createStoryController),
);

// 7. Редагування (Тільки власник)
storiesRouter.patch(
    "/:storyId",
    isValidId("storyId"),
    upload.single("storyImage"),
    validateBody(updateStorySchema),
    ctrlWrapper(updateStoryController),
);

// 8. Видалення (Тільки власник)
storiesRouter.delete(
    "/:storyId",
    isValidId("storyId"),
    ctrlWrapper(deleteStoryByIdController),
);

export default storiesRouter;