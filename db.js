import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();


let config

if(process.env.NODE_ENV === 'test') {
    config = {
        user: process.env.DB_USER_TEST,
        host: process.env.DB_HOST_TEST,
        database: process.env.DB_NAME_TEST,
        password: process.env.DB_PASSWORD_TEST,
        port: process.env.DB_PORT_TEST
    };
}else if(process.env.NODE_ENV === 'production'){
    config = {connectionString: process.env.DATABASE_URL};
}else {
    config = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT
    };
 }

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the db');
});

export default pool;