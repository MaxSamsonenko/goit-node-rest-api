import express from "express";

import authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";

import { authSignInSchema, authSignUpSchema } from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post("signup", isEmptyBody, validateBody(authSignUpSchema));

export default authRouter;
