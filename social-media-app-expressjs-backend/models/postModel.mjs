import db from '../config/db.mjs';
import { createFollowTable } from './followModel.mjs';

const createPostTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Post table created or already exists");
    } catch (error) {
        return false;
    }
};

const createLikeTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                post_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
            );
        `);

        console.log("Like table created or already exists");
    } catch (error) {
        return false;
    }
};

export const createPost = async (userId, content) => {

    await createPostTable();

    if (!userId || !content) {
        return false;
    }
    const [result] = await db.query(
        'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())',
        [userId, content]
    );
    return result.insertId;
};

export const getAllPosts = async (limit, offset, userId) => {
    await createPostTable();
    await createLikeTable();
    await createFollowTable();

    // Assuming the follows table is already created
    // Fetch total count of posts
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM posts');

    // Fetch paginated posts with joined user, like, and follow data
    const [posts] = await db.query(
        `
        SELECT posts.*, users.username,
            COUNT(likes.id) AS totalLikes,
            MAX(CASE 
                WHEN likes.user_id = ? THEN true 
                ELSE false 
            END) AS isLikedByCurrentUser,
            MAX(CASE 
                WHEN follows.follower_id = ? THEN true 
                ELSE false 
            END) AS isFollowedByCurrentUser
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        LEFT JOIN follows ON users.id = follows.followed_id AND follows.follower_id = ?
        GROUP BY posts.id, users.username
        ORDER BY posts.created_at DESC
        LIMIT ? OFFSET ?`,
        [userId, userId, userId, limit, offset]
    );

    // Calculate pagination details
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    // Return posts along with pagination details
    return {
        posts,
        pagination: {
            total,
            currentPage,
            totalPages,
            limit,
            offset
        }
    };
};

export const likePost = async (userId, postId) => {
    await createLikeTable();
    if (userId && postId) {
        const [existingLike] = await db.query(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );
        if (existingLike.length > 0) {
            return false;
        }

        const [result] = await db.query(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            [userId, postId]
        );
        return result.affectedRows > 0;
    } else {
        return false;
    }
};

export const unlikePost = async (userId, postId) => {
    await createLikeTable();
    if (userId && postId) {
        const [result] = await db.query(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );
        return result.affectedRows > 0;
    } else {
        return false;
    }
};

export const updatePostContent = async (postId, content) => {
    await createPostTable();
    if (!postId || !content) {
        return false;
    }
    const [result] = await db.query(
        'UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?',
        [content, postId]
    );
    return result.affectedRows > 0;
};

export const deletePostById = async (postId) => {
    await createPostTable();
    if (!postId) {
        return false;
    }
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [postId]);
    return result.affectedRows > 0;
};