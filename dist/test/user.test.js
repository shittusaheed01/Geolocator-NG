"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let userServer = app_1.default.listen(4010, () => {
    console.log(`userExpressApp started`);
});
//  Runs before all the tests
beforeAll((done) => {
    // local db for testing
    const TEST_URI = "mongodb://127.0.0.1:27017/localetest";
    mongoose_1.default.connect(TEST_URI);
    mongoose_1.default.connection.on("connected", async () => {
        console.log("Connected to MongoDB Successfully");
        done();
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.log("An error occurred while connecting to MongoDB");
        console.log(err);
        done();
    });
});
//  Runs after all the tests
afterAll((done) => {
    mongoose_1.default.connection.dropDatabase(() => {
        mongoose_1.default.connection.close(done);
    });
    userServer.close();
});
it("should signup a user", async () => {
    const response = await (0, supertest_1.default)(userServer)
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
    const response = await (0, supertest_1.default)(userServer)
        .post("/api/v1/user/login")
        .set("content-type", "application/json")
        .send({
        email: "ademola@gmail.com",
        password: "qwerty",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("data");
    expect(response.body.message).toBe("Success. Welcome Ademola Adekunle");
    expect(response.body.data).toHaveProperty("apiKey");
});
