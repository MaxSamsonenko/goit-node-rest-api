import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		avatarUrl: {
			type: String,
		},
		token: {
			type: String,
			default: null,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true }
);
userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
