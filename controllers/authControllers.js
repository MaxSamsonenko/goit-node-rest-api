import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import compareHash from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

const register = async (req, res) => {
	const { email } = req.body;
	const user = await authServices.findUser({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}
	const newUser = await authServices.saveUser(req.body);

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

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	current: ctrlWrapper(current),
};
