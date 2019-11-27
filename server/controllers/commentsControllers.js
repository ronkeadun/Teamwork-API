import pool from "../../db.js";


const Comment = {

	/**
   * create article comment
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
	createArticleComment(req,res,next){
		const findOneQuery = 'SELECT * FROM articles WHERE articleid=$1 AND user_id = $2';
		pool.query(findOneQuery, [req.params.articleId, req.userData.userId], (err,result)=>{
			if(!result.rows[0]) {
				return res.status(404).json({
	    			"status" : "error",
	    			"message": "article not found"
	    		});
			}

			const values = [
				req.body.comment,
				result.rows[0].title,
				req.userData.userEmail,
				req.userData.userId,
				req.params.articleId,
			]

			pool.query(`INSERT INTO comments(comment,articleTitle,author,user_id,article_id,createdOn)
			VALUES($1,$2,$3,$4,$5,NOW() ) RETURNING *`,values, 
			(q_err,q_res)=>{
				if(q_err){
					return res.status(400).json({
			    		"status" : "error",
			    		"message": q_err.detail
			    	});		
				}
				res.json({
					"status" : "success",
					"data" : {
						"message" : "Comment successfully created",
						"createdOn" : q_res.rows[0].createdon,
						"articleTitle" : q_res.rows[0].articletitle,
						"article" : result.rows[0].article,
						"comment" : q_res.rows[0].comment
					}
				})
			})
		});	
	},

	/**
   * create gif comment
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
	createGifComment(req,res,next){
		const findOneQuery = 'SELECT * FROM gifs WHERE gifid=$1 AND user_id = $2';
		pool.query(findOneQuery, [req.params.gifId, req.userData.userId], (err,result)=>{
			if(!result.rows[0]) {
				return res.status(404).json({
	    			"status" : "error",
	    			"message": "gif not found"
	    		});
			}

			const values = [
				req.body.comment,
				result.rows[0].title,
				req.userData.userEmail,
				req.userData.userId,
				req.params.gifId,
			]

			pool.query(`INSERT INTO comments(comment,gifTitle,author,user_id,gif_id,createdOn)
			VALUES($1,$2,$3,$4,$5,NOW() ) RETURNING *`,values, 
			(q_err,q_res)=>{
				if(q_err){
					return res.status(400).json({
			    		"status" : "error",
			    		"message": q_err.detail
			    	});		
				}
				res.json({
					"status" : "success",
					"data" : {
						"message" : "comment successfully created",
						"createdOn" : q_res.rows[0].createdon,
						"gifTitle" : q_res.rows[0].giftitle,
						"comment" : q_res.rows[0].comment
					}
				})
			})
		});	
	}
}

export default Comment;