import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const updateUserFavoritesSchema = Joi.object({
  storyId: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!isValidObjectId(value)) {
        return helper.message("Story id should be a valid mongo id");
      }
      return value;
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().max(32).optional(),
  avatarUrl: Joi.string().optional(),
  description: Joi.string().max(150).optional(),
});
