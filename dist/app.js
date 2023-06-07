"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
// import localeRoute from "./routes/localeRoute";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: `Hello There! Welcome to Saheed's Geolocation app!`,
    });
});
// app.use('/api/v1/locale', localeRoute );
app.use("/api/v1/user", userRoute_1.default);
//handle unknown route error
app.use("*", (req, res) => {
    res.status(404).json({
        status: "failed",
        message: "Route doesn't exist",
    });
});
//Error Handling Middleware
app.use((err, req, res, next) => {
    console.log(err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something broke!";
    res.status(errorStatus).json({
        status: "failed",
        message: errorMessage,
    });
    next();
});
exports.default = app;
