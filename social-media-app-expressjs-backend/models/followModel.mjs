import db from '../config/db.mjs';

const createFollowTable = async () => {
    try {
        // follower_id  // The user who is following
        // followed_id  // The user being followed
        await db.query(`
            CREATE TABLE IF NOT EXISTS follows (
                id INT AUTO_INCREMENT PRIMARY KEY,
                follower_id INT NOT NULL,
                followed_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log('Follow table created or already exists');
    } catch (error) {
        console.error('Error creating follow table:', error);
        throw error;
    }
};

export const followUser = async (followerId, followeeId) => {
    await createFollowTable();
    await db.query(
        'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
        [followerId, followeeId]
    );
};
