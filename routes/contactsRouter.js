import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";
import contactsControllers from "../controllers/contactsControllers.js";
import {
	createContactSchema,
	updateContactSchema,
	updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../decorators/validateBody.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();
contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post(
	"/",
	isEmptyBody,
	validateBody(createContactSchema),
	contactsControllers.createContact
);

contactsRouter.put(
	"/:id",
	isValidId,
	isEmptyBody,
	validateBody(updateContactSchema),
	contactsControllers.updateContact
);

contactsRouter.patch(
	"/:id/favorite",
	isValidId,
	validateBody(updateStatusSchema),
	contactsControllers.updateStatusContact
);

export default contactsRouter;
