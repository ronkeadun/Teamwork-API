import pool from '../../db';
const seed = (c)=>{
    const sql = `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
			userId SERIAL PRIMARY KEY,
			firstName VARCHAR(255) NOT NULL,
			lastName VARCHAR(255) NOT NULL,
			email VARCHAR(255),
			password VARCHAR(255) NOT NULL,
			userRole VARCHAR(255),
			gender VARCHAR(255),
			jobRole VARCHAR(255),
			department VARCHAR(255),
			address VARCHAR(255),
			UNIQUE(email)
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

const users = pool.connect( (err,client,done)=>{
    if(err){
		return console.error("error fetching client from pool \n Error: ", JSON.stringify(err, undefined, 2), err);
	}
    if(process.env.SEED){
     	//call done to release the client back to the pool
        done();
        seed(client);
     }
});

export default users;