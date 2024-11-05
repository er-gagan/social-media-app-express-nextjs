import express from 'express';
import { followAnotherUser } from '../controllers/userController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

router.post('/:userId/follow', authMiddleware, followAnotherUser);

export default router;
