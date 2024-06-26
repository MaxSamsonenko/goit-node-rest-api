import fs from "fs/promises";
import path from "path";

import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const avatarPath = path.resolve("public", "avatars");

const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user;
	const filter = { owner };
	const fields = "-createdAt -updatedAt";
	const { page = 1, limit = 2 } = req.query;
	const skip = (page - 1) * limit;
	const settings = { skip, limit };
	const result = await contactsService.listContacts({
		filter,
		fields,
		settings,
	});
	const total = await contactsService.countContacts(filter);
	res.json({
		total,
		result,
	});
};

const getOneContact = async (req, res) => {
	const { id: _id } = req.params;
	const { _id: owner } = req.user;
	const result = await contactsService.getContact({ _id, owner });
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const deleteContact = async (req, res) => {
	const { id: _id } = req.params;
	const { _id: owner } = req.user;
	const result = await contactsService.removeContact({ _id, owner });
	if (!result) {
		throw HttpError(404);
	}
	res.status(200).json({ message: "Contact deleted" });
};

const createContact = async (req, res) => {
	const { _id: owner } = req.user;
	const { path: oldPath, filename } = req.file;
	const newPath = path.join(avatarPath, filename);

	await fs.rename(oldPath, newPath);
	const avatarUrl = path.join("avatars", filename);

	const newContact = await contactsService.addContact({
		...req.body,
		owner,
		avatarUrl,
	});

	res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
	const { id: _id } = req.params;
	const { _id: owner } = req.user;
	const result = await contactsService.updateContact({ _id, owner }, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { id: _id } = req.params;
	const { _id: owner } = req.user;
	const result = await contactsService.updateContact({ _id, owner }, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

export default {
	getAllContacts: ctrlWrapper(getAllContacts),
	getOneContact: ctrlWrapper(getOneContact),
	deleteContact: ctrlWrapper(deleteContact),
	createContact: ctrlWrapper(createContact),
	updateContact: ctrlWrapper(updateContact),
	updateStatusContact: ctrlWrapper(updateStatusContact),
};
