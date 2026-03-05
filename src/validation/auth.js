import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(32).required().messages({
        "string.min": "Name should have a minimum length of 3",
        "string.max": "Name should have a maximum length of 32",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().max(64).required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(8).max(128).required().messages({
        "string.min": "Password should have a minimum length of 8",
        "any.required": "Password is required",
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

export const googleConfirmSchema = Joi.object({
    code: Joi.string().required().messages({
        "any.required": "Code is required",
    }),
});

export const requestResetEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    token: Joi.string().required(),
});