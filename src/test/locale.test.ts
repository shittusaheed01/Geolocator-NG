import mongoose from "mongoose";
import localeRequest from "supertest";


import localeApp from "../app";


//  Runs before all the tests
let token:string;
let serverlocaleApp = localeApp.listen(4000, ():void => {
  console.log(`localeApp started`);
})
beforeAll((done) => {

  // local db for testing
  const TEST_URI = "mongodb://127.0.0.1:27017/localetest";
  mongoose.connect(TEST_URI);

  mongoose.connection.on("connected", async () => {
    console.log("Connected to MongoDB Successfully");
      

      //signup created user
      const loginResponse = await localeRequest(serverlocaleApp)
      .post("/api/v1/user/signup")
      .set("content-type", "application/json")
      .send({
        email: "ademola@gmail.com",
        password: "qwerty",
        name: "Ademola Adekunle",
        repeat_password: "qwerty",
      })
      token = loginResponse.body.data.apiKey;
      console.log(token)

    done();
  });
});

//  Runs after all the tests(close server and mongodb)
afterAll((done) => {
  
  mongoose.connection.dropDatabase(() => {
    mongoose.connection.close(done);
  });
  serverlocaleApp.close()
});

describe('Locale Routes',  () => {
  //read all regions
  it('should return all regions', async () => {

      const response = await localeRequest(serverlocaleApp)
      .get('/api/v1/locale/regions')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

        
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', "Success")
      expect(response.body).toHaveProperty('results')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('regions')
  })

  //read all states
  it('should return all states', async () => {

      const response = await localeRequest(serverlocaleApp)
      .get('/api/v1/locale/states')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

  
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', "Success")
      expect(response.body).toHaveProperty('results')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('states')
  })
  //read all lgas
  it('should return all lgas', async () => {

      const response = await localeRequest(serverlocaleApp)
      .get('/api/v1/locale/lgas')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', "Success")
      expect(response.body).toHaveProperty('results')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('localGovts')
  })

  //read all locale
  it('should return all locale', async () => {

      const response = await localeRequest(serverlocaleApp)
      .get('/api/v1/locale/')
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', "Success")
      expect(response.body).toHaveProperty('results')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('locale')
  })

});