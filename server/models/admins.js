import pool from '../../db';
const seed = (c)=>{
    const sql = `
        DROP TABLE IF EXISTS admins;
        CREATE TABLE admins(
            adminId SERIAL PRIMARY KEY,
            email VARCHAR(255),
            password VARCHAR(255) NOT NULL,
            userRole VARCHAR(255) NOT NULL DEFAULT 'admin',
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

const admins = pool.connect( (err,client,done)=>{
    if(err){
		return console.error("error fetching client from pool \n Error: ", JSON.stringify(err, undefined, 2), err);
	}
    if(process.env.SEED){
     	//call done to release the client back to the pool
        done();
        seed(client);
     }
});

export default admins;