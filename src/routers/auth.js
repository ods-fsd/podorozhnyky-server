import express from "express";

import {
    registerController,
    loginController,
    getCurrentUserController,
} from "../controllers/users.js";
import {
    logout
} from "../controllers/authController.js"

import {
    authenticate
} from "../middlewares/authenticate.js";
import {
    validateBody
} from "../middlewares/validateBody.js";

import {
    registerSchema,
    loginSchema,
    googleConfirmSchema,
    requestResetEmailSchema,
    resetPasswordSchema
} from "../validation/auth.js";
import {
    ctrlWrapper
} from "../utils/ctrlWrapper.js";
import {
    getGoogleOAuthUrl,
    confirmGoogleAuth,
    requestResetEmail,
    resetPassword
} from '../controllers/authController.js';


const router = express.Router();

router.get('/google-url', getGoogleOAuthUrl);
router.post('/google-confirm', validateBody(googleConfirmSchema), confirmGoogleAuth);


router.post(
    "/register",
    validateBody(registerSchema),
    ctrlWrapper(registerController)
);


router.post(
    "/login",
    validateBody(loginSchema),
    ctrlWrapper(loginController)
);


router.get(
    "/current",
    authenticate,
    ctrlWrapper(getCurrentUserController)
);


router.post(
    "/send-reset-email",
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmail)
);

router.post(
    "/reset-pwd",
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPassword)
);

router.post(
    "/logout",
    ctrlWrapper(logout)
);

export default router;