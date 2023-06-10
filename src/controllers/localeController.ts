import { RequestHandler } from "express";
import Locale from "../models/localeModel";

export const getLocale: RequestHandler = async (req, res, next) => {
	const locale: any = await Locale.find({});
	res
		.status(200)
		.json({ message: `Success`, results: locale.length, data: { locale } });
};

//get all state

//get a state by id

//find a state by region, state and lgas allow the lgas to be optional
/*
  Allow the user to search for a state by region, state and lgas
  when they search by region, the can choose to see the state or the regions
  and when they search by state, they can choose to see the lgas or the regions
*/
