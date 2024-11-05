import db from '../config/db.mjs';

const createUserTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log('User table created or already exists.');
    } catch (error) {
        console.error('Error creating user table:', error);
        throw error;
    }
};

export const findUserByEmail = async (email) => {
    await createUserTable();
    const [result] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return result[0];
};

export const findUserById = async (id) => {
    await createUserTable();
    const [result] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return result[0];
};

export const createUser = async (username, email, hashedPassword) => {
    console.log("Creating user:", username, email, hashedPassword);
    await createUserTable();
    const [result] = await db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
    );
    return result.insertId;
};