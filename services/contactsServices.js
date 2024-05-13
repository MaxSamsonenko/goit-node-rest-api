import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
	const { filters = {} } = search;
	return Contact.find(filters);
};

export const getContactById = async (contactId) => {
	const result = await Contact.findById(contactId);
	return result;
};

export const removeContact = (contactId) =>
	Contact.findByIdAndDelete(contactId);

export const addContact = async (data) => Contact.create(data);

export const updateContactById = (id, data) =>
	Contact.findByIdAndUpdate(id, data);
