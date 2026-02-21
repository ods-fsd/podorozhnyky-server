import express from 'express';
import { logoutController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/logout', authenticate, logoutController);

export default router;