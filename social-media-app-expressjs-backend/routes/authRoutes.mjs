import express from 'express';
import { register, login, getUserData } from '../controllers/authController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user-data', authMiddleware, getUserData);

export default router;
