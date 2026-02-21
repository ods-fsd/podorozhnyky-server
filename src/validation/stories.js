import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
};

export const createStorySchema = Joi.object({
    title: Joi.string().max(80).required(),
    article: Joi.string().max(2500),
    description: Joi.string().max(2500),
    shortDescription: Joi.string().max(150).optional(),
    category: Joi.string()
        .custom(objectIdValidator, "MongoDB ObjectId")
        .required(),
}).or("article", "description");

export const updateStorySchema = Joi.object({
    title: Joi.string().max(80),
    article: Joi.string().max(2500),
    description: Joi.string().max(2500),
    shortDescription: Joi.string().max(150).optional(),
    category: Joi.string().custom(objectIdValidator, "MongoDB ObjectId"),
});