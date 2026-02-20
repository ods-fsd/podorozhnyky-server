import {
    isValidObjectId
} from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (idName = 'id') => {
    return (req, res, next) => {
        const id = req.params[idName];
        if (!id) {
            throw createHttpError(400, 'Bad Request: ID is missing');
        }

        if (!isValidObjectId(id)) {
            return next(createHttpError(400, `${id} is not valid id`));
        }

        next();
    };
};