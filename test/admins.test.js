import app from "../app";
import chai, { expect } from 'chai';
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const basePath = '/api/v1';
const adminSignup = `${basePath}/register-admin`;

const oldAdminDetails = {
	email : "shade@gmail.com",
	password: "Great",
	userRole: "admin"
};

const newAdminDetails = {
	email : "dele@gmail.com",
	password: "Great",
	userRole: "admin"
};
let adminToken;

describe("Admin route tests", ()=>{
	
	before( (done)=>{
		//get token
		chai
			.request(app)
			.post(adminSignup)
			.send(oldAdminDetails)
			.end((err, res)=>{
				adminToken = res.body.data.token
				console.log(adminToken)
				done()
			})
	})

	describe("Admin routes", ()=>{
		context("POST /signup", ()=>{
			
			it("should not create a new user and return 409 if email was found", (done)=>{
				chai
					.request(app)
					.post(adminSignup)
					.send(oldAdminDetails)
					.end((err, res)=>{
						expect(res.status).to.equal(409)
						expect(res.body.status).to.equal("error")
						done()
					})
			})

			it("should create a new user if email is not found", (done)=>{
				chai
					.request(app)
					.post(adminSignup)
					.send(newAdminDetails)
					.end((err, res)=>{
						expect(res.status).to.equal(201)
						expect(res.body).not.to.empty
						expect(res.body.data).to.have.property("token")
						expect(res.body.data.message).to.equal("Admin account successfully created")
						expect(res.body.status).to.equal("success")
						done()
					})
			})
		})
	})
	
});