import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    UsersCollection
} from '../models/user.js';
import {
    SessionsCollection
} from '../models/session.js';
import {
    logoutUser
} from '../services/auth.js';
import {
    sendEmail
} from '../utils/sendMail.js';
import {
    OAuth2Client
} from 'google-auth-library';
import {
    randomBytes
} from 'crypto';

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

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

    const clearOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };

    res.clearCookie('sessionId', clearOptions);
    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);

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
            const randomPassword = randomBytes(16).toString('hex');

            user = await UsersCollection.create({
                name: (given_name || 'User').replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ]/g, '').padEnd(3, 'a').substring(0, 32),
                email,
                password: randomPassword,
                avatarUrl: picture,
            });
        }

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        const refreshToken = randomBytes(30).toString('base64');
        const accessTokenValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const refreshTokenValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const session = await SessionsCollection.create({
            userId: user._id,
            accessToken: token,
            refreshToken,
            accessTokenValidUntil,
            refreshTokenValidUntil,
        });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        };

        res.cookie('sessionId', session._id.toString(), {
            ...cookieOptions,
            expires: refreshTokenValidUntil,
        });

        res.cookie('accessToken', token, {
            ...cookieOptions,
            expires: accessTokenValidUntil,
        });

        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            expires: refreshTokenValidUntil,
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

import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';

export const requestResetEmail = async (req, res) => {
    try {
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
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.APP_DOMAIN || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

        const templatePath = path.join(process.cwd(), 'src', 'templates', 'resetPassword.hbs');
        const templateSource = await fs.readFile(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        const html = template({
            name: user.name,
            resetLink
        });

        await sendEmail({
            to: email,
            subject: 'Відновлення пароля - Podorozhnyky',
            html
        });

        res.status(200).json({
            message: "Reset email sent"
        });
    } catch (error) {
        console.error("DEBUG:", error);
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
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