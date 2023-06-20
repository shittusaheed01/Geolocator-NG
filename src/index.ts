import Express from "express";
import * as mongoose from "mongoose";

import app from "./app";
import config from "./utils/config";
// import { createClient } from "redis";

interface Options {
	useNewUrlParser: boolean;
	useUnifiedTopology: boolean;
	dbName: string;
}

const option: Options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: config.DBNAME,
};


// const client = createClient({
// 	url: `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
// });

// client.on("error", (err: Error) => console.log("Redis Client Error", err));

// client.connect().then(async () => {
// 	console.log("connected");
// 	client.set("key", "gbogbovlue ni");
// 	const value = await client.get("key");
// 	console.log(value);
// });

function connectMongo(server: Express.Application) {
	const uri: string = config.DBLOCAL;
	mongoose.set("strictQuery", false);
	mongoose
		.connect(uri, option)
		.then(() =>
			server.listen(config.PORT, () => {
				console.log(`Server and MongoDB are listening on port ${config.PORT}`);
			})
		)
		.catch((err: any) => console.log(err));
}

connectMongo(app);
