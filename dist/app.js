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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const localeRoute_1 = __importDefault(require("./routes/localeRoute"));
const app = (0, express_1.default)();
//Swagger Documentation
const newSwag = JSON.parse(fs.readFileSync(path.join(__dirname, "./swagger-output.json"), "utf8"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: `Hello There! Welcome to Saheed's Geolocation app!`,
    });
});
app.use("/api/v1/locale", localeRoute_1.default);
app.use("/api/v1/user", userRoute_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(newSwag));
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
