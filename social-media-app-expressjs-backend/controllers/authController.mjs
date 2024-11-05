import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByEmail, createUser, findUserById } from '../models/userModel.mjs';

dotenv.config();

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ status_code: 400, message: 'All fields are required' });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status_code: 400, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, email, hashedPassword);
        res.status(201).json({ status_code: 201, message: 'User registered successfully', data: { userId } });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ status_code: 400, message: 'All fields are required' });
        }
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status_code: 404, message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status_code: 401, message: 'Incorrect credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ status_code: 200, message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};


export const getUserData = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        res.status(200).json({ status_code: 200, message: 'User data fetched successfully', data: user });
    } catch (error) {
        res.status(500).json({ status_code: 500, message: error.message });
    }
};