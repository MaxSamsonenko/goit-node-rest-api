import path from "path";
import fs from "fs";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";

const resizeImage = (req, res, next) => {
	if (!req.file) {
		return next(HttpError(400, "No file uploaded"));
	}
	const { email } = req.user;
	const username = email.split("@")[0];
	const filePath = path.join(req.file.destination, req.file.filename);
	const resizedFilePath = path.join(
		req.file.destination,
		`${username}_${req.file.filename}`
	);

	Jimp.read(filePath)
		.then((image) => {
			return image.resize(250, 250).writeAsync(resizedFilePath);
		})
		.then(() => {
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(`Failed to delete temp file: ${err.message}`);
				}
			});
			req.file.path = resizedFilePath;
			req.file.filename = `${username}_${req.file.filename}`;
			next();
		})
		.catch((err) => {
			next(HttpError(500, "Failed to process image"));
		});
};

export default resizeImage;
