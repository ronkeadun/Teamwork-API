import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from "../../db.js";
import Helper from '../middlewares/helper';

class User{

	/**
   * register admin
   * @param {object} req 
   * @param {object} res
   * @returns {object} admin object 
   */

  	static registerAdmin(req, res, next) {  	
    	if (!req.body.email || !req.body.password) {
    		return res.status(400).json({
    			"status" : "error",
    			"message": "You need to provide your email or password"
    		});
    	}
    	if (req.body.userRole !== "admin" ) {
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
				return res.status(409).json({
		    		"status" : "error",
		    		"message": q_err.detail
		    	});		
			}else{
				let token = Helper.generateToken(q_res.rows[0].adminid,q_res.rows[0].email,q_res.rows[0].userrole);
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
  	}

  /**
   * Create A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  	static createUser(req, res, next) {
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
				// return next(q_err)
				return res.status(409).json({
		    		"status" : "error",
		    		"message": q_err.detail
		    	});
				
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

  	/**
   * Login
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  	static userLogin(req, res, next) {
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
    	const text = 'SELECT * FROM users WHERE email = $1';
    	
		pool.query(text, [req.body.email], (q_err,q_res)=>{
			if (!q_res.rows[0]) {
				return res.status(401).json({
					"status" : "error", 
					"message": "The credentials you provided is incorrect"
				});
			}
			if(!Helper.comparePassword(q_res.rows[0].password, req.body.password)) {
				return res.status(400).json({
					"status" : "error",
					"message": "The credentials you provided is incorrect" 
				});
			}
			const token = Helper.generateToken(q_res.rows[0].userid,q_res.rows[0].email,q_res.rows[0].userrole);
			return res.status(200).json({
				"status" : "success",
				data: {
					token,
					"userId" :q_res.rows[0].userid
				}
			});
		});
  	}
  /**
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {object} response
   */
  	static deleteUser(req, res, next) {
	    const deleteQuery = 'DELETE FROM users WHERE userid=$1';
	    pool.query(deleteQuery, [req.params.userId], (err,result)=>{
			if(err){
				return res.status(404).json({
	    			"status": 'error',
	    			"message": err
	  			});
			}
			if(result.rowCount < 1) {
	  			res.status(404).json({
	    			"status": 'error',
	    			"message": 'user not found',
	  			})
			} else {
	  			res.status(200).json({  
	    			"status": 'success',
	    			"message": 'user was deleted successfully',
	  			})
			}
		});
  	}

}

export default User;