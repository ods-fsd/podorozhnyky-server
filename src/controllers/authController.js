import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    UsersCollection
} from '../models/user.js';
import {
    logoutUser
} from '../services/auth.js';

export const register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    const existingUser = await UsersCollection.findOne({
        email
    });
    if (existingUser) return res.status(409).json({
        message: "Email in use"
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UsersCollection.create({
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
    const user = await UsersCollection.findOne({
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
    const {
        sessionId
    } = req.cookies;

    if (sessionId) {
        await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
        message: 'Successfully logged out'
    });
};

export const getGoogleOAuthUrl = async (req, res) => {
    try {
        const url = googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            prompt: 'consent'
        });
        res.status(200).json({
            url
        });
    } catch (error) {
        res.status(500).json({
            message: 'Помилка генерації URL'
        });
    }
};

export const confirmGoogleAuth = async (req, res) => {
    try {
        const {
            code
        } = req.body;

        const {
            tokens
        } = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const {
            email,
            given_name,
            family_name,
            picture
        } = payload;


        let user = await UsersCollection.findOne({
            email
        });

        if (!user) {
            user = await UsersCollection.create({
                name: given_name.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ]/g, '').padEnd(2, 'a'),
                surname: family_name ? family_name.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ]/g, '') : 'User',
                email,
                password: '',
                avatar: picture,
                isVerified: true,
            });
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(200).json({
            token,
            user
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({
            message: 'Помилка авторизації Google'
        });
    }
};

export const requestResetEmail = async (req, res) => {
    const {
        email
    } = req.body;

    const user = await UsersCollection.findOne({
        email
    });
    if (!user) return res.status(404).json({
        message: "User not found"
    });

    const token = jwt.sign({
        n
    }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail(email, 'Reset Password', `Click the link to reset your password: http://localhost:3000/reset-password/${token}`);

    res.status(200).json({
        message: "Reset email sent"
    });
};

export const resetPassword = async (req, res) => {
    const {
        token,
        password
    } = req.body;

    const user = await UsersCollection.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    });
    if (!user) return res.status(400).json({
        message: "Invalid or expired token"
    });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
        message: "Password reset successfully"
    });
};