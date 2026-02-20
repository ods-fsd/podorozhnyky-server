import {
    getUserCurrentService
} from "../services/users.js";
import {
    getAllUsersService
} from "../services/users.js";
import {
    parsePaginationParams
} from "../utils/parsePaginationParams.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    UsersCollection
} from '../models/user.js';
import {
    calculatePaginationData
} from '../utils/calculatePaginationData.js';
import {
    getEnvVar
} from '../utils/getEnvVar.js';

export const registerController = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const existingUser = await UsersCollection.findOne({
            email
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email in use"
            });
        }

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
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
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

        const secret = getEnvVar('JWT_SECRET');
        const token = jwt.sign({
            id: user._id
        }, secret, {
            expiresIn: '24h'
        });

        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getCurrentUserController = async (req, res, next) => {
    const {
        page,
        perPage
    } = req.paginationParams;

    const userId = req.user._id;

    const {
        user,
        totalFavoritesCount
    } = await getUserCurrentService(userId, {
        page,
        perPage,
    });

    const pagination = calculatePaginationData(
        totalFavoritesCount,
        perPage,
        page
    );

    res.status(200).json({
        status: 200,
        message: "Current user data retrieved successfully.",
        data: {
            user,
            pagination,
        },
    });
};
export const getUsersController = async (req, res) => {
    const {
        page,
        perPage
    } = parsePaginationParams(req.query);

    const result = await getAllUsersService({
        page,
        perPage,
    });

    res.status(200).json({
        status: 200,
        message: "Successfully found users!",
        data: result,
    });
};