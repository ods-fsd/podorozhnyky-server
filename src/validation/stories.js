import Joi from 'joi';

const objectIdRegexp = /^[0-9a-fA-F]{24}$/;

export const updateStorySchema = Joi.object({
  title: Joi.string().min(2).max(120),
  description: Joi.string().min(10).max(5000),
  category: Joi.string().pattern(objectIdRegexp).messages({
    'string.pattern.base': 'category must be a valid ObjectId',
  }),
}).min(1);