import app from "../app";
import chai, { expect } from 'chai';
import chaiHttp from "chai-http";

chai.use(chaiHttp);
const basePath = '/api/v1';
const userLogin = `${basePath}/auth/signin`;
const adminSignup = `${basePath}/register-admin`;
const createUser = `${basePath}/auth/create-user`;
const postArticle = `${basePath}/articles`;
const singleArticle = `${basePath}/articles/:articleId`;
const allArticle = `${basePath}/feed`;

const article1 = {
	title: "Creativity",
	article: "How to unlock your hidden genius",
	author: "Shade"
}
	
const article2 = {
	title: "Strength",
	article: "Strength training research study",
	author: "Ronke",
	user_id: "2",
	createdOn: "03:07:2019",
}

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

const newUser = {
	firstName: "Seun",
	lastName : "Jones",
	email : "seun@gmail.com",
	userRole: "user",
	password: "Great",
	gender: "male",
	jobRole: "user",
	department: "Sales",
	address: "Ogba"
}

const adminDetails = {
	email : "kunle@gmail.com",
	password: "Great",
	userRole: "admin"
};

let adminToken;
let userToken;

describe.skip("Article route tests", ()=>{
	
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

	describe("Article routes", ()=>{
		beforeEach(()=>{
			chai
				.request(app)
				.post(createUser)
				.set('token', adminToken)
				.send(newUser)
				.end((err, res)=>{
					userToken = res.body.data.token
					console.log(userToken)
					done()
				})
		})
		// let userToken;
		context("POST /articles", ()=>{

			it("should create a new article if user is found", (done)=>{
				chai
					.request(app)
					.post(postArticle)
					.set('token', userToken)
					.send(article1)
					.end((err, res)=>{
						expect(res.status).to.equal(201)
						expect(res.body).not.to.be.empty
						expect(res.body.data).to.have.property("title")
						expect(res.body.data.message).to.equal("Article successfully posted")
						expect(res.body.status).to.equal("success")
						done()
					})
			})
			
			it("should not create a new article if user was not found", (done)=>{
				chai
					.request(app)
					.post(postArticle)
					.set('token', userToken)
					.send(article1)
					.end((err, res)=>{
						expect(res.status).to.equal(400)
						expect(res.body.status).to.equal("error")
						done()
					})
			})

		})

		context("UPDATE /article", ()=>{
			
			it("should return error 404 if article was not found", (done)=>{
				chai
					.request(app)
					.patch(singleArticle)
					.set('token', userToken)
					.send(article2)
					.end((err, res)=>{
						expect(res.status).to.equal(404)
						expect(res.body.status).to.equal("error")
						expect(res.body.message).to.equal("article not found")
						done()
					})
			})

			it("should update article if found", (done)=>{
				chai
					.request(app)
					.patch(singleArticle)
					.set('token', userToken)
					.send(article1)
					.end((err, res)=>{
						expect(res.status).to.equal(200)
						expect(res.body).not.to.empty
						expect(res.body.data).to.have.property("title")
						expect(res.body.data).to.have.property("article")
						expect(res.body.status).to.equal("success")
						expect(res.body.message).to.equal("Article successfully updated")
						done()
					})
			})

		})
	})

})