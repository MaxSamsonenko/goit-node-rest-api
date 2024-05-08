import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});

const DB_HOST =
	"mongodb+srv://samsonenkomaxwork:chhw4RTsMhCB0Gd4@home-task.ldmf3n0.mongodb.net/phonebook?retryWrites=true&w=majority&appName=home-task";
//connect to database and run server if error show message and stop all processes
mongoose
	.connect(DB_HOST)
	.then(() => {
		console.log("Database Phonebook connected successfuly");
		app.listen(3000, () => {
			console.log("Server is running. Use our API on port: 3000");
		});
	})
	.catch((error) => {
		console.log(error.message);
		process.exit(1);
	});

//chhw4RTsMhCB0Gd4
//samsonenkomaxwork
//mongodb+srv://samsonenkomaxwork:chhw4RTsMhCB0Gd4@home-task.ldmf3n0.mongodb.net/
//mongodb+srv://samsonenkomaxwork:chhw4RTsMhCB0Gd4@home-task.ldmf3n0.mongodb.net/phonebook?retryWrites=true&w=majority&appName=home-task
