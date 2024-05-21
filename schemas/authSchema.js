import Joi from "joi";

export const authSignUpSchema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().required(),
	subscription: Joi.string(),
});

export const authSignInSchema = Joi.object({
	password: Joi.string().min(6).required(),
	email: Joi.string().required(),
});
