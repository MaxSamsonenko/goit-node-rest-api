import express from "express";

import authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";

import { authLoginSchema, authRegisterSchema } from "../schemas/authSchema.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
	"/register",
	isEmptyBody,
	validateBody(authRegisterSchema),
	authControllers.register
);
authRouter.post(
	"/login",
	isEmptyBody,
	validateBody(authLoginSchema),
	authControllers.login
);

authRouter.get("/current", authenticate, authControllers.current);
authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
