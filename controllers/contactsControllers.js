import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
	const result = await contactsService.listContacts();
	res.json(result);
};

const getOneContact = async (req, res) => {
	console.log(req.params);
	const { id } = req.params;
	const contact = await contactsService.getContactById(id);
	if (!contact) {
		throw HttpError(404);
	}
	res.json(contact);
};

const deleteContact = async (req, res) => {
	const { id } = req.params;
	const result = await contactsService.removeContact(id);
	if (!result) {
		throw HttpError(404);
	}
	res.status(200).json({ message: "Contact deleted" });
};

const createContact = async (req, res) => {
	const newContact = await contactsService.addContact(req.body);

	res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
	const { id } = req.params;
	const result = await contactsService.updateContactById(id, req.body);
	if (!result) {
		throw HttpError(404);
	}
	res.json(result);
};

const updateStatusContact = async (req, res) => {
	const { id } = req.params;
	const result = await contactsService.updateContactById(id, req.body);
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
