import { RequestHandler } from "express";
import Locale from "../models/localeModel";
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
export const cache: RequestHandler = async (req, res, next) => {
	// const { username } = req.params;
	// console.log(req.route.path)
	// let value;


	//checks if the route is the root route or a predefined route
	if(req.route.path.length >= 1){
		// value = ""
		console.log("from locale db");
	}else{
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

	const resp = { message: `Success`, results: locale.length, data: { locale } };
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
	// client.set("/regions", JSON.stringify(resp));

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
	// client.set("/states", JSON.stringify(resp));

	res.status(200).json(resp);
};

export const getLgas: RequestHandler = async (req, res, next) => {
	const { page = 0, statesPerPage = 20 } = req.query;

	const lgaData = await Locale.find({}).select("+lgas");

	const lgaArray: string[][] = lgaData.map((lga) => lga.lgas);
	const localGovts: string[] = lgaArray.flat().sort();

	// Calculate the starting and ending indices of the current page
	const startIndex: number = +page * +statesPerPage;
	const endIndex: number = +startIndex + +statesPerPage;

	// Get the paginated results using the slice() method
	const paginatedData = localGovts.slice(startIndex, endIndex);

	const resp = {
		message: `Success`,
		results: paginatedData.length as Number,
		data: { localGovts: paginatedData },
	};
	//Send to Redis
	// client.set("/lgas", JSON.stringify(resp));

	res.status(200).json(resp);
};
