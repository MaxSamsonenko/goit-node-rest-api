import * as authServices from "../services/authServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const signup = async (req, res) => {};

export default {
	signup: ctrlWrapper(signup),
};
