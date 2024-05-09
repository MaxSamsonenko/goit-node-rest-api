import * as contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import {
	createContactSchema,
	updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res, next) => {
	const result = await contactsService.listContacts();
	res.json(result);
};

const getOneContact = async (req, res, next) => {
	const { id } = req.params;
	const contact = await contactsService.getContactById(id);
	if (!contact) {
		throw HttpError(404);
	}
	res.json(contact);
};

const deleteContact = async (req, res, next) => {
	const { id } = req.params;
	const result = await contactsService.removeContact(id);
	if (!result) {
		throw HttpError(404);
	}
	res.status(200).json(result);
};

const createContact = async (req, res, next) => {
	const { error } = createContactSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
	const { name, email, phone } = req.body;
	const newContact = await contactsService.addContact(name, email, phone);
	res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
	const { error } = updateContactSchema.validate(req.body);
	if (error) {
		throw HttpError(400, error.message);
	}
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
};
