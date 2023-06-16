import app from "./app";
import * as mongoose from "mongoose";
import Express from "express";
import config from "./utils/config"


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

function connectMongo(server: Express.Application) {
	const uri: string = config.MONGO_URI;
	mongoose.set("strictQuery", false);
	mongoose
		.connect(uri, option)
		.then(() =>
			server.listen(config.PORT, () => {
				console.log(`Server and MongoDB are listening on port ${config.PORT}`);
			})
		)
		.catch((err) => console.log(err));
}

connectMongo(app);
