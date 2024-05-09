import Contact from "../models/Contact.js";

export const listContacts = async () => Contact.find();

export const getContactById = async (contactId) => {};

export const removeContact = async (contactId) => {};

export const addContact = async (name, email, phone) => {};

export const updateContactById = async (id, data) => {};
