import { RequestHandler } from "express";
import Locale from "../models/localeModel";
import {client} from '../utils/cacheMiddleware'


export const getLocale: RequestHandler = async (req, res, next) => {
	const { state, region, page = 1, statesPerPage = 10 } = req.query;

	const findQuery: {
		state?: object;
		region?: object;
	} = {};

	if (state) {
		findQuery.state = { $regex: state as String, $options: "i" };
	}
	if (region) {
		findQuery.region = { $regex: region as String, $options: "i" };
	}
	if(+page < 1) {
		return next({ status: 400, message: `Invalid page number` });
	}

	let locale: any;
	if (findQuery.state) {
		locale = await Locale.find(findQuery)
			.select("+lgas +senatorial_districts +past_governors +borders +known_for")
			.skip((Number(page) -1) * Number(statesPerPage))
			.limit(Number(statesPerPage));
	} else {
		locale = await Locale.find(findQuery)
			.skip((Number(page) -1) * Number(statesPerPage))
			.limit(Number(statesPerPage));
	}

	if (locale.length === 0) {
		return next({ status: 404, message: `No result found` });
	}

	const resp = { message: `Success`, results: locale.length, data: { locale } };

	if (state) {
		client.set(state as string, JSON.stringify(resp));
	}
	res.status(200).json(resp);
};

export const getRegions: RequestHandler = async (req, res, next) => {
	const regionsAndData = await Locale.aggregate([
		{
			$group: {
				_id: "$region",
				states: { $push: "$state" },
				lgas: { $push: "$lgas" },
			},
		},
	]);

	const regions: string[] = regionsAndData.map((locale) => locale._id).sort();

	const resp = {
		message: `Success`,
		results: regionsAndData.length as Number,
		data: { regions, regionsAndData },
	};
	//Send to Redis
	client.set("/regions", JSON.stringify(resp));

	res.status(200).json(resp);
};

export const getStates: RequestHandler = async (req, res, next) => {
	const statesAndData = await Locale.aggregate([
		{ $group: { _id: "$state", lgas: { $push: "$lgas" } } },
	]);

	const states: string[] = statesAndData.map((locale) => locale._id).sort();

	const resp = {
		message: `Success`,
		results: statesAndData.length as Number,
		data: { states, statesAndData },
	};
	//Send to Redis
	client.set("/states", JSON.stringify(resp));

	res.status(200).json(resp);
};

export const getLgas: RequestHandler = async (req, res, next) => {
	const { page = 1, lgasPerPage = 20 } = req.query;

	if (+page < 1) {
		return next({ status: 400, message: `Invalid page number` });
	}

	const lgaData = await Locale.find({}).select("+lgas");

	const lgaArray: string[][] = lgaData.map((lga) => lga.lgas);
	const localGovts: string[] = lgaArray.flat().sort();

	// Calculate the starting and ending indices of the current page
	const startIndex: number = (+page - 1) * +lgasPerPage;
	const endIndex: number = +startIndex + +lgasPerPage;

	// Get the paginated results using the slice() method
	const paginatedData = localGovts.slice(startIndex, endIndex);

	if (paginatedData.length === 0) {
		return next({ status: 404, message: `No result found` });
	}

	const resp = {
		message: `Success`,
		results: paginatedData.length as Number,
		data: { localGovts: paginatedData },
	};

	res.status(200).json(resp);
};
