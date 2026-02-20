import Joi from 'joi';
import mongoose from 'mongoose';

// Перевірка, чи є рядок валідним MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required(),
  article: Joi.string().max(2500).required(),
  shortDescription: Joi.string().max(150).optional(),
  category: Joi.string()
    .custom(objectIdValidator, 'MongoDB ObjectId')
    .required(),
});

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80),
  article: Joi.string().max(2500),
  shortDescription: Joi.string().max(150).optional(),
  category: Joi.string().custom(objectIdValidator, 'MongoDB ObjectId'),
});