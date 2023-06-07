"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Enter your name'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Enter an email'],
        trim: true
    },
    password: {
        type: String,
        required: [true, "incorrect password"],
        select: false
    },
    apiKey: {
        type: String,
        required: true,
    }
}, { timestamps: true });
//UserSchema Methods
userSchema.pre('save', async function (next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password'))
        return next();
    const salt = await bcrypt_1.default.genSalt(), hash = await bcrypt_1.default.hash(user.password, salt);
    user.password = hash;
    next();
});
userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt_1.default.compare(password, user.password);
    return compare;
};
// Create the User model
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
