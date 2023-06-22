"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
// const localeRequest = require("supertest");
const supertest_1 = __importDefault(require("supertest"));
// const localeApp = require("../localeApp");
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
        //login created user
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
        /**
         *
         */
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', "Success");
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('locale');
    });
    //   //read with query
    //   it('should return blogs with state: draft', async () => {
    //       const response = await localeRequest(serverlocaleApp)
    //       .get('/blog?state=draft')
    //       .set('content-type', 'localeApplication/json')
    //       // .set('Authorization', `Bearer ${token}`)
    //       expect(response.status).toBe(200)
    //       expect(response.body).toHaveProperty('blog')
    //       expect(response.body).toHaveProperty('message', "blogs gotten")
    //       expect(response.body.blog.every(blog => blog.state === "draft")).toBe(true)
    //   })
    //   //read current user blog
    //   it('should return logged in blogs', async () => {
    //       const response = await localeRequest(serverlocaleApp)
    //       .get('/blog/me')
    //       .set('content-type', 'localeApplication/json')
    //       .set('Authorization', `Bearer ${token}`)
    //       expect(response.status).toBe(200)
    //       expect(response.body).toHaveProperty('blog')
    //       expect(response.body).toHaveProperty('message', "blogs gotten")
    //       expect(response.body.blog.length).toBe(2)
    //   })
    //   //read with id
    //   it('should return blogs with specified id', async () => {
    //     const { _id: blogId } = await blogModel.findOne({
    //       title:"6 bullets"})
    //       const response = await localeRequest(serverlocaleApp)
    //       .get(`/blog/${blogId}`)
    //       .set('content-type', 'localeApplication/json')
    //       // .set('Authorization', `Bearer ${token}`)
    //       expect(response.status).toBe(200)
    //       expect(response.body).toHaveProperty('message', "blogs gotten")
    //       expect(response.body).toHaveProperty('blog')
    //       expect(response.body.blog).toHaveProperty('description', "A movie")
    //   })
    //   //post blog
    //   it('should post blog', async () => {
    //       const response = await localeRequest(serverlocaleApp)
    //       .post(`/blog/`)
    //       .set('content-type', 'localeApplication/json')
    //       .set('Authorization', `Bearer ${token}`)
    //       .send({  
    //         "title":"Better Call Saul S06Ep7",
    //         "tags":["Movie", "Netflix",  "Breaking Bad",  "AltSchool"],
    //         "description":"Wikipedia synopsis",
    //         "body":"On the day of the Sandpiper settlement conference, Jimmy and Kim hastily reshoot their photos with the actor impersonating Casimiro, then pass them to Howard's private investigator, who is actually working for them. Howard ingests Caldera's drug upon contact with the photos and embarrasses himself at the conference by localeAppearing manic and accusing Casimiro of accepting a bribe. Howard and Cliff are forced to settle the Sandpiper case for less than they wanted. Lalo surveils Gus's laundry, realizing he has built a hidden meth lab there. Calling Hector, he tells him he will attack Gus that night after realizing Gus's men monitored his call. Mike alerts Gus and redirects his security teams to protect Gus, leaving Kim and Jimmy’s apartment unprotected. Howard deduces that Jimmy and Kim plotted his character assassination and confronts them at their apartment. Lalo arrives soon afterward, intending to interrogate Jimmy and Kim. Kim urges Howard to leave, but Lalo kills him with a gunshot to his head."
    //     })
    //       expect(response.status).toBe(201)
    //       expect(response.body).toHaveProperty('blog')
    //       expect(response.body.blog).toHaveProperty('title', "Better Call Saul S06Ep7")
    //       expect(response.body.blog).toHaveProperty('description', "Wikipedia synopsis")
    //       expect(response.body.blog).toHaveProperty('reading_time')
    //   })
    //   //update blog
    //   it('should update blogs with specified id', async () => {
    //     const { _id: blogId } = await blogModel.findOne({
    //       title:"6 bullets"})
    //       const response = await localeRequest(serverlocaleApp)
    //       .patch(`/blog/${blogId}`)
    //       .set('content-type', 'localeApplication/json')
    //       .set('Authorization', `Bearer ${token}`)
    //       .send({state:"published"})
    //       expect(response.status).toBe(201)
    //       expect(response.body).toHaveProperty('message', "blog updated")
    //       expect(response.body).toHaveProperty('blog')
    //       expect(response.body.blog).toHaveProperty('state', "published")
    //   })
    //   //delete blog with id
    //   it('should delete blog with specified id', async () => {
    //     const { _id: blogId } = await blogModel.findOne({
    //       title:"6 bullets"})
    //       const response = await localeRequest(serverlocaleApp)
    //       .delete(`/blog/${blogId}`)
    //       .set('content-type', 'localeApplication/json')
    //       .set('Authorization', `Bearer ${token}`)
    //       expect(response.status).toBe(201)
    //       expect(response.body).toHaveProperty('message', "blog deleted")
    //   })
});
