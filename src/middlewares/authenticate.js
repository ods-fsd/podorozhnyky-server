<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import { UsersCollection } from '../db/models/user.js';

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await UsersCollection.findById(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
=======
import jwt from "jsonwebtoken";
import {
    UsersCollection
} from "../models/user.js";

const {
    JWT_SECRET
} = process.env;

export const authenticate = async (req, res, next) => {
    const {
        authorization = ""
    } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }

    try {
        const {
            id
        } = jwt.verify(token, JWT_SECRET);
        const user = await UsersCollection.findById(id);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Not authorized"
        });
    }
>>>>>>> main
};