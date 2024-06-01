import express from "express";

import authControllers from "../controllers/authControllers.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";

import {
	authLoginSchema,
	authRegisterSchema,
	authEmailSchema,
} from "../schemas/authSchema.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import resizeImage from "../middlewares/resizeImage.js";

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
authRouter.patch(
	"/avatars",
	authenticate,
	upload.single("avatar"),
	resizeImage,
	authControllers.changeAvatar
);

authRouter.get("/verify/:verificationToken", authControllers.verify);
authRouter.post(
	"/verify",
	isEmptyBody,
	validateBody(authEmailSchema),
	authControllers.resendVerify
);

export default authRouter;
