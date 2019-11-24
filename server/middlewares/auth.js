import jwt from 'jsonwebtoken';
import pool from '../../db';

const Auth = {
  /**
   * admin User
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */ 

  verifyAdmin(req, res, next){
    const token = req.headers['token'] || req.headers.authorization || req.headers['x-access-token']
    try{
      const decoded = jwt.verify(token, process.env.SECRET)
      if(decoded.userRole !== "admin") {
        console.log(decoded)
        return res.status(400).json({
          "status" : "error", 
          "message": "Only admins are authorized to create new users" 
        });
      }else{
        next()
      }
    }catch(error) {
      return res.status(401).json({
        "error":error
      });
    }
  }

  
}

export default Auth;