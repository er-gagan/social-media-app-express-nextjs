import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.mjs';
import postRoutes from './routes/postRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';
import { errorHandler } from './middlewares/errorMiddleware.mjs';
import db from './config/db.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


db.getConnection((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully.');
    }
});

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
