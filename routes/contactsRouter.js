import express from "express";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import contactsControllers from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", isEmptyBody, contactsControllers.createContact);

contactsRouter.put("/:id", isEmptyBody, contactsControllers.updateContact);

export default contactsRouter;
