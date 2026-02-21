<<<<<<< HEAD
import Joi from 'joi';

const objectIdRegexp = /^[0-9a-fA-F]{24}$/;

export const updateStorySchema = Joi.object({
  title: Joi.string().min(2).max(120),
  description: Joi.string().min(10).max(5000),
  category: Joi.string().pattern(objectIdRegexp).messages({
    'string.pattern.base': 'category must be a valid ObjectId',
  }),
}).min(1);
=======
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
  // Робимо обидва поля необов'язковими в схемі, але...
  article: Joi.string().max(2500),
  description: Joi.string().max(2500),
  shortDescription: Joi.string().max(150).optional(),
  category: Joi.string()
    .custom(objectIdValidator, "MongoDB ObjectId")
    .required(),
}).or("article", "description"); // ...вимагаємо, щоб ХОЧА Б ОДНЕ з них було обов'язково

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80),
  article: Joi.string().max(2500),
  description: Joi.string().max(2500),
  shortDescription: Joi.string().max(150).optional(),
  category: Joi.string().custom(objectIdValidator, "MongoDB ObjectId"),
});
>>>>>>> main
