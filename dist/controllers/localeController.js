"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLgas = exports.getStates = exports.getRegions = exports.getLocale = exports.cache = void 0;
const localeModel_1 = __importDefault(require("../models/localeModel"));
// import { createClient } from "redis";
// import config from "../utils/config";
// const client = createClient({});
// const client = createClient({
// 	url: `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}/#11723373`,
// });
// client.connect().then( () => {
// 	console.log("Redis connected");
// });
// client.on("error", (err: Error) => {
// 	console.log("Redis Client Error", err)
// 	throw err;
// });
//Cache middleware
const cache = async (req, res, next) => {
    // const { username } = req.params;
    // console.log(req.route.path)
    // let value;
    //checks if the route is the root route or a predefined route
    if (req.route.path.length >= 1) {
        // value = ""
        console.log("from locale db");
    }
    else {
        // value = await client.get(req.route.path);
    }
    // if (value !== null) {
    // 	// const data = JSON.parse(value);
    // 	return res.status(200).json(data);
    // } else {
    // 	next();
    // }
    next();
};
exports.cache = cache;
const getLocale = async (req, res, next) => {
    const { state, region, page = 0, statesPerPage = 10 } = req.query;
    const findQuery = {};
    if (state) {
        findQuery.state = { $regex: state, $options: "i" };
    }
    if (region) {
        findQuery.region = { $regex: region, $options: "i" };
    }
    let locale;
    if (findQuery.state) {
        locale = await localeModel_1.default.find(findQuery)
            .select("+lgas +senatorial_districts +past_governors +borders +known_for")
            .skip(Number(page) * Number(statesPerPage))
            .limit(Number(statesPerPage));
    }
    else {
        locale = await localeModel_1.default.find(findQuery)
            .skip(Number(page) * Number(statesPerPage))
            .limit(Number(statesPerPage));
    }
    const resp = { message: `Success`, results: locale.length, data: { locale } };
    res.status(200).json(resp);
};
exports.getLocale = getLocale;
const getRegions = async (req, res, next) => {
    const regionsAndData = await localeModel_1.default.aggregate([
        {
            $group: {
                _id: "$region",
                states: { $push: "$state" },
                lgas: { $push: "$lgas" },
            },
        },
    ]);
    const regions = regionsAndData.map((locale) => locale._id).sort();
    const resp = {
        message: `Success`,
        results: regionsAndData.length,
        data: { regions, regionsAndData },
    };
    //Send to Redis
    // client.set("/regions", JSON.stringify(resp));
    res.status(200).json(resp);
};
exports.getRegions = getRegions;
const getStates = async (req, res, next) => {
    const statesAndData = await localeModel_1.default.aggregate([
        { $group: { _id: "$state", lgas: { $push: "$lgas" } } },
    ]);
    const states = statesAndData.map((locale) => locale._id).sort();
    const resp = {
        message: `Success`,
        results: statesAndData.length,
        data: { states, statesAndData },
    };
    //Send to Redis
    // client.set("/states", JSON.stringify(resp));
    res.status(200).json(resp);
};
exports.getStates = getStates;
const getLgas = async (req, res, next) => {
    const { page = 0, statesPerPage = 20 } = req.query;
    const lgaData = await localeModel_1.default.find({}).select("+lgas");
    const lgaArray = lgaData.map((lga) => lga.lgas);
    const localGovts = lgaArray.flat().sort();
    // Calculate the starting and ending indices of the current page
    const startIndex = +page * +statesPerPage;
    const endIndex = +startIndex + +statesPerPage;
    // Get the paginated results using the slice() method
    const paginatedData = localGovts.slice(startIndex, endIndex);
    const resp = {
        message: `Success`,
        results: paginatedData.length,
        data: { localGovts: paginatedData },
    };
    //Send to Redis
    // client.set("/lgas", JSON.stringify(resp));
    res.status(200).json(resp);
};
exports.getLgas = getLgas;
