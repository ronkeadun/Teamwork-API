import pool from "../../db.js";
import Helper from '../middlewares/gifsMiddlewares.js';
import upload from '../middlewares/gifsMiddlewares';
import cloudinary from 'cloudinary';
import env from 'dotenv';

env.config();

//Setting up cloudinary
cloudinary.config({
	cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
})


const Gif = {
	/**
   * Create Gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
	createGif(req, res, next){
		upload(req, res, (err) =>{
			if(err){
				res.json({
					"status" : "error",
    				"message": err
				})	
			}else if(req.file == undefined){
				res.json({
					"status" : "error",
    				"message": "No file selected"
				})
			}else{		
				cloudinary.v2.uploader.upload(req.file.path, (err,result)=>{
					req.body.imageUrl = result.secure_url
					const values = [
						req.body.title,
						req.body.imageUrl,
						req.userData.userId
					]
					pool.query(`INSERT INTO gifs(title,imageUrl,user_id,createdOn)
					VALUES($1,$2,$3,NOW() ) RETURNING *`,values, 
					(q_err,q_res)=>{
						if(q_err) {
							return res.status(400).json({
					    		"status" : "error",
					    		"message": q_err.detail
					    	});		
						}
						res.json({
							"status" : "success",
							"data" : {
								"gifId": q_res.rows[0].gifid,
								"message" : "GIF image successfully posted",
								"createdOn" : q_res.rows[0].createdon,
								"title" : q_res.rows[0].title,
								"imageUrl":q_res.rows[0].imageurl
							}
						})
					})		
				})	
			}
		})		

	}
}

export default Gif;