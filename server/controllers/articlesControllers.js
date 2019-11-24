import pool from "../../db.js";


const Article = {

	/**
   * create article
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
	createArticle(req,res,next){
		const values = [
			req.body.title,
			req.body.article,
			req.body.author,
			req.body.user_id
		]
		pool.query(`INSERT INTO articles(title,article,author,user_id,createdOn)
			VALUES($1,$2,$3,$4,NOW() ) RETURNING *`,values, 
			(q_err,q_res)=>{
				if(q_err) return next(q_err)
				
				res.json({
					"status" : "success",
					"data" : {
						"message" : "Article successfully posted",
						"articleId" : q_res.rows[0].articleid,
						"createdOn" : q_res.rows[0].createdon,
						"title" : q_res.rows[0].title,
					}
				})
			})
	}

}

export default Article;