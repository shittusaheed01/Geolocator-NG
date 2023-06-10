"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocale = void 0;
const localeModel_1 = __importDefault(require("../models/localeModel"));
const getLocale = async (req, res, next) => {
    const locale = await localeModel_1.default.find({});
    res
        .status(200)
        .json({ message: `Success`, results: locale.length, data: { locale } });
};
exports.getLocale = getLocale;
//get all state
//get a state by id
//find a state by region, state and lgas allow the lgas to be optional
/*
  Allow the user to search for a state by region, state and lgas
  when they search by region, the can choose to see the state or the regions
  and when they search by state, they can choose to see the lgas or the regions
*/
