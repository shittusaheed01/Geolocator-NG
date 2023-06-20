"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
//Verify Token
const verifyToken = async (req, res, next) => {
    //Auth header value = > send token into header
    const bearerHeader = req.headers['authorization'];
    // console.log(bearerHeader);
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split the space at the bearer
        const bearer = bearerHeader.split(' ');
        // Get token from string
        const bearerToken = bearer[1];
        try {
            const user = await userModel_1.default.findOne({ apiKey: bearerToken });
            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized",
                    error: "You are not authorized to access this resource, please provide a valid API key or register for one"
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return res.status(403).json({
            message: "Forbidden",
            error: "You are not authorized to access this resource"
        });
    }
};
exports.verifyToken = verifyToken;
