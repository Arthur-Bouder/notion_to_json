import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../middlewares/authMiddleware.js";

import { User } from "../models/user.model.js";
import { isCurrentUser } from "../utils/user.utils.js";

export const registerUser = async (request, response) => {
	const { email, password, username } = request.body;

	if (!email || !password || !username) {
		return response
			.status(400)
			.send("Email, password and username are required");
	}

	const existing = await User.findOne({ email });
	if (existing) {
		return response.status(400).send("User already exists");
	}

	const hash = await bcrypt.hash(password, 10);
	const user = new User({ email, password: hash, username });
	await user.save();

	const jsonUser = user.toJSON();
	delete jsonUser.password;

	const token = jwt.sign(jsonUser, jwtSecret);

	response.status(201).send({
		token,
		user: jsonUser,
	});
};

export const loginUser = async (request, response) => {
	const { email, password } = request.body;

	if (!email || !password) {
		return response.status(400).send("Email and password are required");
	}

	const user = await User.findOne({ email });
	if (!user) {
		return response.status(401).send("Please check your credentials");
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return response.status(401).send("Please check your credentials");
	}

	const jsonUser = user.toJSON();
	delete jsonUser.password;

	const token = jwt.sign(jsonUser, jwtSecret);

	response.send({
		token,
		user: jsonUser,
	});
};

export const getUser = async (request, response) => {
	const userId = request.params.id;
	const user = await User.findById(userId);

	if (!user) {
		return response.status(404).send("User not found");
	}

	delete user.password;

	response.send(user);
};

export const updateUser = async (request, response) => {
	const userId = request.params.id;

	if (!isCurrentUser(request, userId)) {
		return response
			.status(403)
			.send("You are not authorized to perform this action");
	}

	const { email, password, username } = request.body;

	const user = await User.findById(userId);
	if (!user) {
		return response.status(404).send("User not found");
	}

	const updatedUser = {
		email: email || user.email,
		password: password ? await bcrypt.hash(password, 10) : user.password,
		username: username || user.username,
	};

	await User.findByIdAndUpdate(userId, updatedUser, { new: true });

	response.send("User updated");
};

export const deleteUser = async (request, response) => {
	const userId = request.params.id;

	if (!isCurrentUser(request, userId)) {
		return response
			.status(403)
			.send("You are not authorized to perform this action");
	}

	await User.findByIdAndDelete(userId);

	response.send("User deleted");
};
