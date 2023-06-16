"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLgas = exports.getStates = exports.getRegions = exports.getLocale = void 0;
const localeModel_1 = __importDefault(require("../models/localeModel"));
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
    // console.log(noOfLgas)
    res
        .status(200)
        .json({ message: `Success`, results: locale.length, data: { locale } });
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
    res.status(200).json({
        message: `Success`,
        results: regionsAndData.length,
        data: { regions, regionsAndData },
    }); //data: { regionsAndData },
};
exports.getRegions = getRegions;
const getStates = async (req, res, next) => {
    const statesAndData = await localeModel_1.default.aggregate([
        { $group: { _id: "$state", lgas: { $push: "$lgas" } } },
    ]);
    const states = statesAndData.map((locale) => locale._id).sort();
    res.status(200).json({
        message: `Success`,
        results: statesAndData.length,
        data: { states, statesAndData },
    });
};
exports.getStates = getStates;
const getLgas = async (req, res, next) => {
    const { page = 0, statesPerPage = 20 } = req.query;
    const lgaData = await localeModel_1.default.find({})
        .select("+lgas");
    const lgaArray = lgaData.map((lga) => lga.lgas);
    const localGovts = lgaArray.flat().sort();
    // Calculate the starting and ending indices of the current page
    const startIndex = +page * +statesPerPage;
    const endIndex = +startIndex + +statesPerPage;
    // Get the paginated results using the slice() method
    const paginatedData = localGovts.slice(startIndex, endIndex);
    res.status(200).json({
        message: `Success`,
        results: paginatedData.length,
        data: { localGovts: paginatedData },
    });
};
exports.getLgas = getLgas;
