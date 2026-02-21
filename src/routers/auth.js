import express from "express";

import {
  registerController,
  loginController,
  getCurrentUserController,
  logoutController,
} from "../controllers/users.js";

import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const router = express.Router();



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
  "/logout",
  authenticate,
  ctrlWrapper(logoutController)
);

export default router;
