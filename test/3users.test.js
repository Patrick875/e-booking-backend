process.env.NODE_ENV = "test";

//Require the dev-dependencies
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import request from "supertest";
import User from "../src/models/User";

let should = chai.should();
chai.use(chaiHttp);

let token;

const expect = chai.expect;

let allUsers ;

describe("----- USER LOGIN and REGISTER ------", async function () {
  before(async (done) => {
    await User.deleteMany({}, done());
  });

  // afterEach(async (done) => {
  //   await User.deleteMany({}, done());
  // });

  it("returns one of names, email or password not passed (400) ", async function () {
    const response = await request(app).post("/api/auth/register").send({
      names: "Anathole K",
    });
    expect(response.status).to.eql(400);
    expect(400, "names, email and password are required.");
  });

  it("returns new user with and status (201)", async function () {
    let response;

    await User.deleteOne({});
    while (!response) {

      response = await request(app).post("/api/auth/register").send({
        names: "Anathole K",
        password: "1234",
        email: "test@gmail.com",
        roles: "user",
      });
    }

    expect(response.status).to.eql(201);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("success");
  });

  it("returns user with the same email exist (409) ", async function () {
    const user = await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    // console.log(user.body);

    if (user) {
      const response = await request(app).post("/api/auth/register").send({
        names: "Anathole Karinganire",
        password: "1234",
        email: "test@gmail.com",
        roles: "user",
      });
      expect(response.status).to.eql(409);
      expect(response.body).to.be.an("object");
    }
  });

  it(" Login return one of email or password not passed ahead with request (400)", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
    });
    expect(response.status).to.eql(400);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("message");


  });

  it(" Login return unregistred a user (401) ", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });
    const response = await request(app).post("/api/auth/login").send({
      password: "1234",
      email: "anonimous@gmail.com",
    });
    expect(response.status).to.eql(401);
  });

  it("Login with invalid credenstials ie: password incorrect (200) ", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "12345678",
    });
    token = response.body.accessToken;
    expect(response.status).to.eql(401);
    expect(response.body).to.be.an("object");
  });

  // AUTH
  it("/POST Authenticcate a user and get a token to use for the rest of the APIs (200) ", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });
    token = response.body.accessToken;
    expect(response.status).to.eql(200);
    expect(response.body).to.be.an("object");
  });

  it(" GET users without access priviledge 401", async function () {
    const response = await request(app).get("/api/users/all");
    expect(response.status).to.eql(401);
  });

  // GET all users (200)
  it(" GET users with access priviledge 200", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });

    token = loginResponse.body.accessToken;

    const response = await request(app)
      .get("/api/users/all")
      .set({
        token: `Bearer ${token}`,
      });
    expect(response.status).to.eql(200);
    expect(response.body).to.be.an("array");
  });


  // get user  with bad ID format
  it(" /GET user with bad ID format passing along with path -> returns  422", async function () {
    await request(app).post("/api/auth/register").send({
      names: "Anathole K",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });

    const response = await request(app)
      .get("/api/users/hjdhgjhgjdfhgjdgdffsfsd")
      .set({
        token: `Bearer ${loginResponse.body.accessToken}`,
      });
    expect(response.status).to.eql(422);
    expect(response.body).to.have.property("message");
  });

  // Get an existing user
  it(" /GET user with ID -> returns  200", async function () {
    let allUsers;

    await request(app).post("/api/auth/register").send({
      names: "Anathole Kk",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });

    allUsers = await request(app)
      .get("/api/users/all")
      .set({
        token: `Bearer ${loginResponse.body.accessToken}`,
      });

    const response = await request(app)
      .get(`/api/users/${allUsers.body[0]._id}`)
      .set({
        token: `Bearer ${loginResponse.body.accessToken}`,
      });
    expect(response.status).to.eql(200);
    expect(response.body).to.be.an("object");
  });

  // Get a  user not found
  it(" /GET user with Id not found -> returns  (204)", async function () {
    let allUsers;

    await request(app).post("/api/auth/register").send({
      names: "Anathole Kk",
      password: "1234",
      email: "test@gmail.com",
      roles: "user",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "1234",
    });

    allUsers = await request(app)
      .get("/api/users/all")
      .set({
        token: `Bearer ${loginResponse.body.accessToken}`,
      });

    await User.deleteOne({});
    const response = await request(app)
      .get(`/api/users/${allUsers.body[0]._id}`)
      .set({
        token: `Bearer ${loginResponse.body.accessToken}`,
      });
    expect(response.status).to.eql(204);
  });
});
