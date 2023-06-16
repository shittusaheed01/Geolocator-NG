import { RequestHandler } from "express";
import Locale from "../models/localeModel";

export const getLocale: RequestHandler = async (req, res, next) => {
	const { state, region, page = 0, statesPerPage = 10 } = req.query;

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

	let locale: any;
	if (findQuery.state) {
		locale = await Locale.find(findQuery)
			.select("+lgas +senatorial_districts +past_governors +borders +known_for")
			.skip(Number(page) * Number(statesPerPage))
			.limit(Number(statesPerPage));
	} else {
		locale = await Locale.find(findQuery)
			.skip(Number(page) * Number(statesPerPage))
			.limit(Number(statesPerPage));
	}

	// console.log(noOfLgas)
	res
		.status(200)
		.json({ message: `Success`, results: locale.length, data: { locale } });
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

	res.status(200).json({
		message: `Success`,
		results: regionsAndData.length as Number,
		data:{regions, regionsAndData},
	});  //data: { regionsAndData },
};

export const getStates: RequestHandler = async (req, res, next) => {
	const statesAndData = await Locale.aggregate([
		{ $group: { _id: "$state", lgas: { $push: "$lgas" } } },
	]);

	const states: string[] = statesAndData.map((locale) => locale._id).sort();

	res.status(200).json({
		message: `Success`,
		results: statesAndData.length as Number,
		data: { states, statesAndData },
	});
};

export const getLgas: RequestHandler = async (req, res, next) => {
	const { page = 0, statesPerPage = 20 } = req.query;

	const lgaData = await Locale.find({})
		.select("+lgas")

	const lgaArray: string[][] = lgaData.map((lga) => lga.lgas);
	const localGovts: string[] = lgaArray.flat().sort();

	
	// Calculate the starting and ending indices of the current page
	const startIndex: number = +page * +statesPerPage;
	const endIndex: number = +startIndex + +statesPerPage;
	
	// Get the paginated results using the slice() method
	const paginatedData = localGovts.slice(startIndex, endIndex);

	res.status(200).json({
		message: `Success`,
		results: paginatedData.length as Number,
		data: { localGovts: paginatedData },
	});
};
