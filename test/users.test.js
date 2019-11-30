import app from "../app";
import chai, { expect } from 'chai';
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const basePath = '/api/v1';
const userLogin = `${basePath}/auth/signin`;
const adminSignup = `${basePath}/register-admin`;
const createUser = `${basePath}/auth/create-user`;

const user = {
	firstName: "Ronke",
	lastName : "Ajayi",
	email : "rok@gmail.com",
	userRole: "admin",
	password: "Good",
	gender: "female",
	jobRole: "employee",
	department: "Sales",
	address: "Ikeja"
}

const nonUser = {
	firstName: "Shade",
	lastName : "Kayode",
	email : "shade@gmail.com",
	userRole: "user",
	password: "Great",
	gender: "male",
	jobRole: "admin",
	department: "Sales",
	address: "Ogba"
}

const adminDetails = {
	email : "seun@gmail.com",
	password: "Great",
	userRole: "admin"
};
let adminToken;

describe("User route tests", ()=>{
	
	before( (done)=>{
		//get token
		chai
			.request(app)
			.post(adminSignup)
			.send(adminDetails)
			.end((err, res)=>{
				adminToken = res.body.data.token
				console.log(adminToken)
				done()
			})
	})

	describe("User routes", ()=>{
		let userToken;
		context("POST /create-user", ()=>{

			it("should create a new user if email is not found", (done)=>{
				chai
					.request(app)
					.post(createUser)
					.set('token', adminToken)
					.send(user)
					.end((err, res)=>{
						expect(res.status).to.equal(201)
						expect(res.body).not.to.be.empty
						expect(res.body.data).to.have.property("token")
						expect(res.body.data.message).to.equal("User account successfully created")
						expect(res.body.status).to.equal("success")
						userToken = res.body.data.token
						done()
					})
			})
			
			it("should not create a new user and return 409 if email was found", (done)=>{
				chai
					.request(app)
					.post(createUser)
					.set('token', adminToken)
					.send(user)
					.end((err, res)=>{
						expect(res.status).to.equal(409)
						expect(res.body.status).to.equal("error")
						done()
					})
			})

		})

		context("POST /signin", ()=>{
			
			it("should return error 401 if user email and password was not found", (done)=>{
				chai
					.request(app)
					.post(userLogin)
					.set('token', userToken)
					.send(nonUser)
					.end((err, res)=>{
						expect(res.status).to.equal(401)
						expect(res.body.status).to.equal("error")
						expect(res.body.message).to.equal("The credentials you provided is incorrect")
						done()
					})
			})

			it("should login registered user if email and password are found", (done)=>{
				chai
					.request(app)
					.post(userLogin)
					.set('token', userToken)
					.send(user)
					.end((err, res)=>{
						expect(res.status).to.equal(200)
						expect(res.body).not.to.empty
						expect(res.body.data).to.have.property("token")
						expect(res.body.status).to.equal("success")
						done()
					})
			})

		})
	})

})