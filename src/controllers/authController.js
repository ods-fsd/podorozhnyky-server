import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    User
} from '../models/user.js';
import { logoutUser } from '../services/auth.js';

export const register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    const existingUser = await User.findOne({
        email
    });
    if (existingUser) return res.status(409).json({
        message: "Email in use"
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        user: {
            name: newUser.name,
            email: newUser.email
        }
    });
};

export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({
        email
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });

    res.status(200).json({
        token,
        user: {
            name: user.name,
            email: user.email
        }
    });
};

export const logout = async (req, res) => {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
};