"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
//  Runs before all the tests
let token;
let serverlocaleApp = app_1.default.listen(4000, () => {
    console.log(`localeApp started`);
});
beforeAll((done) => {
    // local db for testing
    const TEST_URI = "mongodb://127.0.0.1:27017/localetest";
    mongoose_1.default.connect(TEST_URI);
    mongoose_1.default.connection.on("connected", async () => {
        console.log("Connected to MongoDB Successfully");
        //signup created user
        const loginResponse = await (0, supertest_1.default)(serverlocaleApp)
            .post("/api/v1/user/signup")
            .set("content-type", "application/json")
            .send({
            email: "ademola@gmail.com",
            password: "qwerty",
            name: "Ademola Adekunle",
            repeat_password: "qwerty",
        });
        token = loginResponse.body.data.apiKey;
        console.log(token);
        done();
    });
});
//  Runs after all the tests(close server and mongodb)
afterAll((done) => {
    mongoose_1.default.connection.dropDatabase(() => {
        mongoose_1.default.connection.close(done);
    });
    serverlocaleApp.close();
});
describe('Locale Routes', () => {
    //read all regions
    it('should return all regions', async () => {
        const response = await (0, supertest_1.default)(serverlocaleApp)
            .get('/api/v1/locale/regions')
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Success");
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('regions');
    });
    //read all states
    it('should return all states', async () => {
        const response = await (0, supertest_1.default)(serverlocaleApp)
            .get('/api/v1/locale/states')
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Success");
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('states');
    });
    //read all lgas
    it('should return all lgas', async () => {
        const response = await (0, supertest_1.default)(serverlocaleApp)
            .get('/api/v1/locale/lgas')
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Success");
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('localGovts');
    });
    //read all locale
    it('should return all locale', async () => {
        const response = await (0, supertest_1.default)(serverlocaleApp)
            .get('/api/v1/locale/')
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Success");
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('locale');
    });
});
