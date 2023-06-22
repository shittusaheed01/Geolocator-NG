"use strict";
const request = require("supertest");
const app = require("../app");
let serverApp = app.default.listen(4000);
afterAll((done) => {
    serverApp.close();
    done();
});
describe("Home Route", () => {
    it("Should return message:welcome to api", async () => {
        const response = await request(serverApp)
            .get("/")
            .set("content-type", "application/json");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "success",
            message: "Hello There! Welcome to Saheed's Geolocation app!",
        });
    });
    it("Should return error when routed to undefined route", async () => {
        const response = await request(serverApp)
            .get("/undefined")
            .set("content-type", "application/json");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: "failed",
            message: "Route doesn't exist",
        });
    });
});
