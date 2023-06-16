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
const path = __importStar(require("path"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: 'GeoLocation API',
        version: '1.0.0',
        description: 'A nigerian geolocation api',
        contact: {
            name: 'Saheed Shittu',
            url: 'http://localhost:5050',
            email: 'shittusaheed01@gmail.com'
        }
    },
    servers: [
        {
            description: 'Dev Route',
            url: 'http://localhost:5050'
        },
        {
            description: 'Production Route',
            url: 'https://geolocatorng.onrender.com'
        }
    ],
    host: 'localhost:5050',
    schemes: ['http', 'https']
};
const options = {
    openapi: '3.0.0',
};
const firstEndpoint = path.join(__dirname, './app.js');
const secondEndpoint = path.join(__dirname, './routes/*.js');
const outputFile = path.join(__dirname, './swagger-output.json');
const endpointFiles = [firstEndpoint, secondEndpoint];
(0, swagger_autogen_1.default)(options)(outputFile, endpointFiles, doc);
