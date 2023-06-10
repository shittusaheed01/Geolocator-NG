"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const uuid_1 = require("uuid");
const getUser = async (req, res, next) => {
    const user = await userModel_1.default.find({});
    res.status(200).json({ message: `Success`, results: user.length, data: { user } });
};
exports.getUser = getUser;
const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    //generate API key
    const apiKey = (0, uuid_1.v4)();
    try {
        const newUser = await new userModel_1.default({
            name,
            email,
            apiKey,
            password,
        });
        await newUser.save();
        res.status(201).json({
            message: `Success. Welcome ${newUser.name}`,
            data: { apiKey },
        });
    }
    catch (error) {
        //handling mongoDB unique error
        if (error.code == 11000) {
            (error.status = 409),
                (error.message = "Email already exists! Try a different one");
        }
        next(error);
    }
};
exports.createUser = createUser;
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel_1.default.findOne({ email }).select("+password");
        if (!user || !(await user.isValidPassword(password))) {
            return next({
                status: 401,
                message: "Incorrect email or password",
            });
        }
        const { apiKey } = user;
        res.status(200).json({ message: `Success. Welcome ${user.name}`, data: { apiKey } });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
