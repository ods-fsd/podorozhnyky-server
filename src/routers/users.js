import {
    Router
} from 'express';

const usersRouter = Router();

import {
    registerController,
    loginController,
    getCurrentUserController,
    getUsersController,
    getUserByIdController,
} from '../controllers/users.js';
import {
    validateBody
} from '../middlewares/validateBody.js';
import {
    registerSchema,
    loginSchema
} from '../validation/auth.js';
import {
    ctrlWrapper
} from '../utils/ctrlWrapper.js';
import {
    isValidId
} from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { addFavoriteController } from '../controllers/users.js';

// ПУБЛІЧНІ МАРШРУТИ
usersRouter.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
usersRouter.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));


usersRouter.get(
    '/:userId',
    isValidId('userId'),
    ctrlWrapper(getUserByIdController),
);

// ПРИВАТНІ МАРШРУТИ (захищені)

usersRouter.post('/me/favorites', authenticate, addFavoriteController);


export default usersRouter;
