import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
	const { email } = req.body;
	const user = await authServices.findUser({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}
	const verificationToken = nanoid();
	const avatarUrl = gravatar.url(email, { s: "200", d: "identicon" }, true);
	const newUser = await authServices.saveUser({
		...req.body,
		verificationToken,
		avatarUrl,
	});

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click here for email verification</a>`,
	};

	await sendEmail(verifyEmail);

	res.status(201).json({
		user: { subscription: newUser.subscription, email: newUser.email },
	});
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(401, "Email or passwor is incorrect");
	}

	if (!user.verify) {
		throw HttpError(
			401,
			"User email is not verified. Check your inbox for confirmation email"
		);
	}

	const comparePassword = await compareHash(password, user.password);
	if (!comparePassword) {
		throw HttpError(401, "Email or password is incorrect");
	}
	const { _id: id } = user;
	const payload = {
		id,
	};
	const token = createToken(payload);
	await authServices.updateUser({ _id: id }, { token });
	res.json({
		token: token,
		user: {
			subscription: user.subscription,
			email: user.email,
		},
	});
};

const current = (req, res) => {
	const { email, subscription } = req.user;

	res.json({
		email,
		subscription,
	});
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await authServices.updateUser({ _id }, { token: null });

	res.status(204).json({
		message: "Successful logout",
	});
};

const changeAvatar = async (req, res) => {
	const { _id } = req.user;
	const { path: oldPath, filename } = req.file;
	const newPath = path.join(avatarPath, filename);

	await fs.rename(oldPath, newPath);
	const avatarUrl = path.join("avatars", filename);

	await authServices.updateUser({ _id }, { avatarUrl });

	res.status(200).json({
		avatarUrl: avatarUrl,
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await authServices.findUser({ verificationToken });
	if (!user) {
		throw HttpError(404, "User not found");
	}
	console.log(user._id);
	await authServices.updateUser(
		{ _id: user._id },
		{ verify: true, verificationToken: null }
	);

	res.json({
		message: "Verification successful",
	});
};

const resendVerify = async (req, res) => {
	const { email } = req.body;
	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(404, "Email not found");
	}
	if (user.verify) {
		throw HttpError(400, "Email already verified");
	}

	const verifyEmail = {
		to: email,
		subject: "Verify email",
		html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click here for email verification</a>`,
	};

	await sendEmail(verifyEmail);

	res.json({
		message: "Verify email resent successfuly",
	});
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	current: ctrlWrapper(current),
	changeAvatar: ctrlWrapper(changeAvatar),
	verify: ctrlWrapper(verify),
	resendVerify: ctrlWrapper(resendVerify),
};
