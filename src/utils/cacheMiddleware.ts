import { RequestHandler } from 'express';
import { createClient } from "redis";

import config from "./config";


export const client = createClient({
	url: `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}/#11723373`,
});


// export const client = createClient({});

//Cache middleware
export const cache: RequestHandler = async (req, res, next) => {
	let value;

	//checks if the route is the root route or a predefined route
	if (req.route.path.length > 1) {
		value = await client.get(req.route.path);
	} else if (req.query.state) {
		value = await client.get(req.query.state as string);
	} else {
		return next();
	}

	if (value) {
		const data = JSON.parse(value);
		console.log("from redis")
		return res.status(200).json(data);
	} else {
		console.log("from db")

		next();
	}
};