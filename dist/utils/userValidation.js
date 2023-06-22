"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidation = exports.RegisterValidation = void 0;
// const Joi = require('joi');
const joi_1 = __importDefault(require("joi"));
const UserRegSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    name: joi_1.default.string().max(20).required().trim(),
    password: joi_1.default.string().required(),
    repeat_password: joi_1.default.ref("password"),
}).with("password", "repeat_password");
const UserLoginSchema = joi_1.default.object({
    email: joi_1.default.string().trim().required(),
    password: joi_1.default.string().required(),
});
async function RegisterValidation(req, res, next) {
    const user = req.body;
    try {
        await UserRegSchema.validateAsync(user);
        next();
    }
    catch (error) {
        next({
            message: error.details[0].message,
            status: 400,
        });
    }
}
exports.RegisterValidation = RegisterValidation;
async function LoginValidation(req, res, next) {
    const user = req.body;
    try {
        await UserLoginSchema.validateAsync(user);
        next();
    }
    catch (error) {
        next({
            message: error.details[0].message,
            status: 400,
        });
    }
}
exports.LoginValidation = LoginValidation;
