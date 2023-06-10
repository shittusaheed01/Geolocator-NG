import express from "express";
import morgan from 'morgan'

import usersRoute from "./routes/userRoute";
import localeRoute from "./routes/localeRoute";


const app = express();

app.use(morgan('dev'))
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
	res.status(200).json({
		status: "success",
		message: `Hello There! Welcome to Saheed's Geolocation app!`,
	});
});

app.use('/api/v1/locale', localeRoute );
app.use("/api/v1/user", usersRoute);

//handle unknown route error
app.use("*", (req, res) => {
	res.status(404).json({
		status: "failed",
		message: "Route doesn't exist",
	});
});

//Error Handling Middleware
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.log(err);

		const errorStatus = err.status || 500;
		const errorMessage = err.message || "Something broke!";
		res.status(errorStatus).json({
			status: "failed",
			message: errorMessage,
		});
		next();
	}
);

export default app;