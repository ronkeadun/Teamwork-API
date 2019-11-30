import pool from '../../db';
const seed = (c)=>{
    const sql = `
        DROP CASCADE TABLE IF EXISTS articles;
        CREATE TABLE articles(
			articleId SERIAL PRIMARY KEY,
			title VARCHAR(255),
			article VARCHAR(255),
			author VARCHAR(255) REFERENCES users(email),
			user_id INT REFERENCES users(userId),
			createdOn TIMESTAMP
		)
    `;
    c.query(sql, (err,result)=>{
        if(err){
            return console.error("error running query", err);
        }
        console.log("seed some data");
        return console.log(result);
    });
}

const articles = pool.connect( (err,client,done)=>{
    if(err){
		return console.error("error fetching client from pool \n Error: ", JSON.stringify(err, undefined, 2), err);
	}
    if(process.env.SEED){
     	//call done to release the client back to the pool
        done();
        seed(client);
     }
});

export default articles;
