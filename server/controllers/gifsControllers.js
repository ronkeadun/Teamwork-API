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
   * @returns {object} gif object 
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
	},

	/**
	* Delete Gif
	* @param {object} req 
	* @param {object} res 
	* @returns {object} response
	*/

	deleteGif(req,res,next){
	
		pool.query("DELETE FROM gifs WHERE gifid=$1 AND user_id = $2", 
			[req.params.gifId, req.userData.userId], (err,result)=>{
			if(err){
				return res.status(400).json({
		    		"status" : "error",
		    		"message": err
		    	});
			}
			if(result.rowCount < 1) {
	  			res.status(404).json({
	    			status: 'error',
	    			message: 'gif not found',
	  			})
			} else {
	  			res.status(200).json({  
	    			status: 'success',
	    			"data": {
						"message" : "gif post successfully deleted"
					}
	  			})
			}
		});
	},

	/**
   * Get A Gif
   * @param {object} req 
   * @param {object} res
   * @returns {object} gif object
   */
  	viewSpecificGif(req, res) {
	    const text = "SELECT * FROM gifs WHERE gifid = $1 AND user_id = $2";
	  	pool.query(text, [req.params.gifId, req.userData.userId], (err,result)=>{
	  		if (err) {
	    		return res.status(404).json({
	    			"status": 'error',
	    			"message": err
	  			});
	    	}
	    	if (!result.rows[0]) {
	    		return res.status(404).json({
	    			"status": 'error',
	    			"message": 'gif not found'
	  			});
	    	}
	    	const text = `SELECT commentid AS "commentId",comment,user_id AS "​authorId" 
	    				FROM comments
	    				WHERE gif_id = $1`;
		  	pool.query(text, [req.params.gifId], (q_err,q_res)=>{
		  		if (q_err) {
		    		return res.status(404).json({
		    			"status": 'error',
		    			"message": q_err
		  			});
		    	}

		    	return res.status(200).json({
		      		"status" : "success",
					"data" : {
						"id": JSON.parse(req.params.gifId),
						"createdOn": result.rows[0].createdon,
						"title": result.rows[0].title,
						"url": result.rows[0].imageurl,
						"comments": q_res.rows
					}
		      	})
		    })
	    });
  	},

  	/**
   * Get All Gifs
   * @param {object} req 
   * @param {object} res
   * @returns {object} gifs object
   */
  	viewAllGifs(req,res,next){
  		const text = `SELECT gifid AS "Id",createdon AS "createdOn",title,imageUrl AS url,user_id AS "​authorId" 
	    				FROM gifs
	    				ORDER BY createdOn DESC`;
		pool.query(text, (err,result)=>{
			if(err){
				return res.status(404).json({
	    			"status": 'error',
	    			"message": err
	  			});
			}
			if(result.rowCount < 1) {
	  			res.status(404).json({
	    			status: 'error',
	    			message: 'No gifs available',
	  			})
			} else {
	  			res.status(200).json({
	  				"status": 'success',
	    			"data": result.rows
	  			})
			}
		});
	}
}

export default Gif;