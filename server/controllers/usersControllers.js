import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from "../../db.js";
import Helper from '../middlewares/helper';

const User = {

	/**
   * register admin
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */

  	registerAdmin(req, res, next) {  	
    	if (!req.body.email || !req.body.password) {
    		return res.status(400).json({
    			"status" : "error",
    			"message": "You need to provide your email or password"
    		});
    	}
    	if (req.body.userRole !== "admin") {
    		return res.status(400).json({
    			"status" : "error",
    			"message": "Only admin can register"
    		});
    	}
    	if (!Helper.isValidEmail(req.body.email)) {
    		return res.status(400).json({
    			"status" : "error", 
    			"message": "Please enter a valid email address" 
    		});
    	}

    	const hashPassword = Helper.hashPassword(req.body.password);

    	const createQuery = `INSERT INTO admins(email,password,userRole) VALUES ($1,$2,$3) RETURNING *;`
	    const values = [
			req.body.email,
			hashPassword,
			req.body.userRole
		];
			
		pool.query(createQuery, values, (q_err,q_res)=>{
			if(q_err){
				return next(q_err);		
			}else{
				const token = Helper.generateToken(q_res.rows[0].adminid,q_res.rows[0].email,q_res.rows[0].userrole);
				res.status(201).json({
					"status" : "success",
					"data": {
						"message" : "Admin account successfully created",
						token,
						"adminId" : q_res.rows[0].adminid
					}
				})
			}
		})
  	},

  /**
   * Create A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  	createUser(req, res, next) {
	    if (!req.body.email || !req.body.password) {
	    	return res.status(400).json({
	    		"status" : "error",
	    		"message": "Some values are missing"
	    	});
	    }
	    if (!Helper.isValidEmail(req.body.email)) {
	    	return res.status(400).json({ 
	    		"status" : "error",
	    		"message": "Please enter a valid email address" 
	    	});
	    }
	    
	    const hashPassword = Helper.hashPassword(req.body.password);

	    const createQuery = `INSERT INTO users(firstName,lastName,email,password,userRole,gender,jobRole,
							department,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
	    const values = [
			req.body.firstName,
			req.body.lastName,
			req.body.email,
			hashPassword,
			req.body.userRole,
			req.body.gender,
			req.body.jobRole,
			req.body.department,
			req.body.address
		];
			
		pool.query(createQuery, values, (q_err,q_res)=>{
			if(q_err){
				return next(q_err)
				
			}else{
				const token = Helper.generateToken(q_res.rows[0].userid,q_res.rows[0].email,q_res.rows[0].userrole);
				res.status(201).json({
					"status" : "success",
					"data": {
						"message" : "User account successfully created",
						token,
						"userId" : q_res.rows[0].userid
					}
				})
			}
		})
  	}
}

export default User;