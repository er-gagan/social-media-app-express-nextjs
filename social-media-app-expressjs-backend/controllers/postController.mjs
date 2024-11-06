import { createPost, deletePostById, getAllPosts, likePost, unlikePost, updatePostContent } from '../models/postModel.mjs';

export const createNewPost = async (req, res) => {
    const { content } = req.body;
    try {
        if (!content) {
            return res.status(400).json({ status_code: 400, message: 'Content is required' });
        }

        const postId = await createPost(req.user.id, content);
        if (!postId) {
            return res.status(500).json({ status_code: 500, message: 'Failed to create post' });
        }
        res.status(201).json({ status_code: 201, message: 'Post created successfully', data: { postId } });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { content, postId } = req.body;
    try {
        if (!content || !postId) {
            return res.status(400).json({ status_code: 400, message: 'Content and Post ID are required' });
        }

        const result = await updatePostContent(postId, content);
        if (!result) {
            return res.status(404).json({ status_code: 404, message: 'Post not found' });
        }
        res.status(200).json({ status_code: 200, message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const fetchPosts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const posts = await getAllPosts(Number(limit), Number(offset), req.user.id);
        if (posts.length === 0) {
            return res.status(404).json({ status_code: 404, message: 'No posts found' });
        }
        res.status(200).json({ status_code: 200, message: 'Posts fetched successfully', data: posts });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const likeAPost = async (req, res) => {
    const { postId } = req.params;
    try {
        if (!postId) {
            return res.status(400).json({ status_code: 400, message: 'Post ID is required' });
        }
        const result = await likePost(req.user.id, postId);
        if (!result) {
            return res.status(404).json({ status_code: 404, message: 'Post not found' });
        }
        res.status(200).json({ status_code: 200, message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const unlikeAPost = async (req, res) => {
    const { postId } = req.params;
    try {
        if (!postId) {
            return res.status(400).json({ status_code: 400, message: 'Post ID is required' });
        }
        const result = await unlikePost(req.user.id, postId);
        if (!result) {
            return res.status(404).json({ status_code: 404, message: 'Post not found' });
        }
        res.status(200).json({ status_code: 200, message: 'Post unliked successfully' });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({ status_code: 400, message: 'Post ID is required' });
        }
        const result = await deletePostById(id);
        if (!result) {
            return res.status(404).json({ status_code: 404, message: 'Post not found' });
        }
        res.status(200).json({ status_code: 200, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};