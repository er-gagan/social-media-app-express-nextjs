import express from 'express';
import { createNewPost, deletePost, fetchPosts, likeAPost, unlikeAPost, updatePost } from '../controllers/postController.mjs';
import { authMiddleware } from '../middlewares/authMiddleware.mjs';

const router = express.Router();

router.post('/', authMiddleware, createNewPost);
router.put('/', authMiddleware, updatePost);
router.delete('/', authMiddleware, deletePost);
router.get('/', authMiddleware, fetchPosts);
router.post('/:postId/like', authMiddleware, likeAPost);
router.post('/:postId/unlike', authMiddleware, unlikeAPost);

export default router;
