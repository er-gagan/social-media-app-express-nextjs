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
        console.log('Post table created or already exists');
    } catch (error) {
        console.error('Error creating post table:', error);
        throw error;
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
        console.log('Like table created or already exists');
    } catch (error) {
        console.error('Error creating like table:', error);
        throw error;
    }
};

export const createPost = async (userId, content) => {
    await createPostTable();
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


// export const getAllPosts = async (limit, offset, userId) => {
//     await createPostTable();
//     await createLikeTable();

//     // Fetch total count of posts
//     const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM posts');

//     // Fetch paginated posts with joined user and like data
//     const [posts] = await db.query(
//         `
//         SELECT posts.*, users.username,
//             COUNT(likes.id) AS totalLikes,
//             MAX(CASE 
//                 WHEN likes.user_id = ? THEN true 
//                 ELSE false 
//             END) AS isLikedByCurrentUser
//         FROM posts
//         JOIN users ON posts.user_id = users.id
//         LEFT JOIN likes ON posts.id = likes.post_id
//         GROUP BY posts.id, users.username
//         ORDER BY posts.created_at DESC
//         LIMIT ? OFFSET ?`,
//         [userId, limit, offset]
//     );

//     // Calculate pagination details
//     const currentPage = Math.floor(offset / limit) + 1;
//     const totalPages = Math.ceil(total / limit);

//     // Return posts along with pagination details
//     return {
//         posts,
//         pagination: {
//             total,
//             currentPage,
//             totalPages,
//             limit,
//             offset
//         }
//     };
// };

export const likePost = async (userId, postId) => {
    await createLikeTable();
    await db.query(
        'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
        [userId, postId]
    );
};

export const unlikePost = async (userId, postId) => {
    await createLikeTable();
    await db.query(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [userId, postId]
    );
};

export const updatePostContent = async (postId, content) => {
    await createPostTable();
    await db.query(
        'UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?',
        [content, postId]
    );
};

export const deletePostById = async (postId) => {
    await createPostTable();
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);
};