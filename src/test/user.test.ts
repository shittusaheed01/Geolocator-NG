import mongoose from "mongoose";
import userRequest from "supertest";

import userExpressApp from "../app";

let userServer = userExpressApp.listen(4010, () => {
	console.log(`userExpressApp started`);
});
//  Runs before all the tests
beforeAll((done) => {
	// local db for testing
	const TEST_URI = "mongodb://127.0.0.1:27017/localetest";
	mongoose.connect(TEST_URI);

	mongoose.connection.on("connected", async () => {
		console.log("Connected to MongoDB Successfully");
		done();
	});

	mongoose.connection.on("error", (err: Error) => {
		console.log("An error occurred while connecting to MongoDB");
		console.log(err);
		done();
	});
});

//  Runs after all the tests
afterAll((done) => {
	mongoose.connection.dropDatabase(() => {
		mongoose.connection.close(done);
	});
	userServer.close();
});

it("should signup a user", async () => {
	const response = await userRequest(userServer)
		.post("/api/v1/user/signup")
		.set("content-type", "application/json")
		.send({
			email: "ademola@gmail.com",
			password: "qwerty",
			name: "Ademola Adekunle",
			repeat_password: "qwerty",
		});

	expect(response.status).toBe(201);
	expect(response.body).toHaveProperty("message");
	expect(response.body).toHaveProperty("data");
	expect(response.body.message).toBe("Success. Welcome Ademola Adekunle");
	expect(response.body.data).toHaveProperty("apiKey");
});

it("should login a user", async () => {
	// login user
	const response = await userRequest(userServer)
		.post("/api/v1/user/login")
		.set("content-type", "application/json")
		.send({
			email: "ademola@gmail.com",
			password: "qwerty",
		});

	// expect(response.status).toBe(200);
	expect(response.body).toHaveProperty("message");
	expect(response.body).toHaveProperty("data");
	expect(response.body.message).toBe("Success. Welcome Ademola Adekunle");
	expect(response.body.data).toHaveProperty("apiKey");
});
