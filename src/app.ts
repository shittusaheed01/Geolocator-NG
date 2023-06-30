import express from "express";
import morgan from "morgan";
import * as fs from "fs";
import * as path from "path";
import rateLimit from "express-rate-limit";

import swaggerUi from "swagger-ui-express";

import usersRoute from "./routes/userRoute";
import localeRoute from "./routes/localeRoute";

const app = express();

//Swagger Documentation
const newSwag = JSON.parse(
	fs.readFileSync(path.join(__dirname, "./swagger-output.json"), "utf8")
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
	res.status(200).json({
		status: "success",
		message: `Hello There! Welcome to Saheed's Geolocation app!`,
	});
});

app.use("/api/v1/locale", localeRoute);
app.use("/api/v1/user", usersRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(newSwag));

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
