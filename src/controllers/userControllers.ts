import { RequestHandler } from "express";
import User from "../models/userModel";
import { v4 as uuidv4 } from "uuid";
import { UserInterface } from "../interfaces/userInterface";

interface RequestBody {
	name: string;
	email: string;
	password?: string;
}

export const getUser: RequestHandler = async (req, res, next) => {
	const user: any = await User.find({})
	res.status(200).json({message: `Success`,results:user.length, data:{user}});
};

export const createUser: RequestHandler = async (req, res, next) => {
	const { name, email, password }: RequestBody = req.body;
	//generate API key
	const apiKey: string = uuidv4();

	try {
		const newUser: UserInterface = await new User({
			name,
			email,
			apiKey,
			password,
		});

		await newUser.save();

		res.status(201).json({
			message: `Success. Welcome ${newUser.name}`,
			data:{apiKey},
		});
	} catch (error: any) {
		//handling mongoDB unique error
		if (error.code == 11000) {
			(error.status = 409),
				(error.message = "Email already exists! Try a different one");
		}

		next(error);
	}
};

export const loginUser: RequestHandler = async (req, res, next) => {
	const { email, password }: RequestBody = req.body;

	try {
		const user: any = await User.findOne({ email }).select("+password");

		if (!user || !(await user.isValidPassword(password))) {
			return next({
				status: 401,
				message: "Incorrect email or password",
			});
		}
		const { apiKey } = user;
		res.status(200).json({ message: `Success. Welcome ${user.name}`, data: {apiKey} });
	} catch (error) {
		next(error);
	}
};

