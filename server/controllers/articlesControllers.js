import pool from "../../db.js";


const Article = {

	/**
   * create article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object 
   */
	createArticle(req,res,next){
		const values = [
			req.body.title,
			req.body.article,
			req.userData.userEmail,
			req.userData.userId
		]
		pool.query(`INSERT INTO articles(title,article,author,user_id,createdOn)
			VALUES($1,$2,$3,$4,NOW() ) RETURNING *`,values, 
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
						"message" : "Article successfully posted",
						"articleId" : q_res.rows[0].articleid,
						"createdOn" : q_res.rows[0].createdon,
						"title" : q_res.rows[0].title
					}
				})
			})
	},

	/**
	* Edit Article
	* @param {object} req 
	* @param {object} res 
	* @returns {object} updated article
	*/

	editArticle(req,res,next){
		const values = [
			req.body.title,
			req.body.article,
			req.userData.userEmail,
			req.params.articleId,
			req.userData.userId
		]
		const findOneQuery = 'SELECT * FROM articles WHERE articleid=$1 AND user_id = $2';
		pool.query(findOneQuery, [req.params.articleId, req.userData.userId], (err,result)=>{
			if(!result.rows[0]) {
				return res.status(404).json({
	    			"status" : "error",
	    			"message": "article not found"
	    		});
			}

			pool.query(`UPDATE articles SET title=$1,article=$2,author=$3,createdOn=NOW()
					WHERE articleid=$4 AND user_id = $5 RETURNING *`,values, 
				(q_err,q_res)=>{
					if(q_err){
						return res.status(400).json({
				    		"status" : "error",
				    		"message": q_err.detail
				    	});		
					}
					res.status(200).json({
						"status" : "success",
						"data" : {
							"message" : "Article successfully updated",
							"title" : q_res.rows[0].title,
							"article" : q_res.rows[0].article
						}
					});
				})
		});	
	},

	/**
	* Delete Article
	* @param {object} req 
	* @param {object} res 
	* @returns {object} response
	*/

	deleteArticle(req,res,next){
	
		pool.query("DELETE FROM articles WHERE articleid=$1 AND user_id = $2", 
			[req.params.articleId, req.userData.userId], (err,result)=>{
			if(err){
				// return next(err);
				return res.status(400).json({
		    		"status" : "error",
		    		"message": err
		    	});	
			}
			if(result.rowCount < 1) {
	  			res.status(404).json({
	    			"status": 'error',
	    			"message": 'article not found',
	  			})
			} else {
	  			res.status(200).json({  
	    			"status": 'success',
	    			"data": {
						"message" : "Article successfully deleted"
					}
	  			})
			}
		});
	},

	/**
   * Get An Article
   * @param {object} req 
   * @param {object} res
   * @returns {object} article object
   */
  	viewSpecificArticle(req, res) {
	    const text = "SELECT * FROM articles WHERE articleid = $1 AND user_id = $2";
	  	pool.query(text, [req.params.articleId, req.userData.userId], (err,result)=>{
	  		if (err) {
	    		return res.status(404).json({
	    			"status": 'error',
	    			"message": err
	  			});
	    	}
	    	if (!result.rows[0]) {
	    		return res.status(404).json({
	    			"status": 'error',
	    			"message": 'article not found'
	  			});
	    	}
	    	const text = `SELECT commentid AS "commentId",comment,user_id AS "​authorId" 
	    				FROM comments
	    				WHERE article_id = $1`;
		  	pool.query(text, [req.params.articleId], (q_err,q_res)=>{
		  		if (q_err) {
		    		return res.status(404).json({
		    			"status": 'error',
		    			"message": q_err
		  			});
		    	}

		    	return res.status(200).json({
		      		"status" : "success",
					"data" : {
						"id": JSON.parse(req.params.articleId),
						"createdOn": result.rows[0].createdon,
						"title": result.rows[0].title,
						"article": result.rows[0].article,
						"comments": q_res.rows
					}
		      	})
		    })
	    });
  	},

  	/**
   * Get All Articles
   * @param {object} req 
   * @param {object} res
   * @returns {object} articles object
   */
  	viewAllArticles(req,res,next){
  		const text = `SELECT articleid AS "Id",createdon AS "createdOn", title, article, user_id AS "​authorId" 
	    				FROM articles
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
	    			message: 'No articles available',
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

export default Article;