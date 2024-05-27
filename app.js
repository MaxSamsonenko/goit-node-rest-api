import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();

const { DB_HOST, PORT } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

//connect to database and run server if error show message and stop all processes
mongoose
	.connect(DB_HOST)
	.then(() => {
		console.log("Database connection successful");
		app.listen(PORT, () => {
			console.log("Server is running. Use our API on port: 3000");
		});
	})
	.catch((error) => {
		console.log(error.message);
		process.exit(1);
	});
