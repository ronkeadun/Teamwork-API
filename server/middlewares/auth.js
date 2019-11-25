import jwt from 'jsonwebtoken';
import pool from '../../db';

const Auth = {
  /**
   * verify Admin
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
          "message": "Only admins are authorized to carry out this operation" 
        });
      }else{
        next()
      }
    }catch(error) {
      return res.status(401).json({
        "error":error
      });
    }
  },

  /**
   * Verify User
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */ 
  verifyUser(req, res, next) {
    const token = req.headers['token'] || req.headers.authorization || req.headers['x-access-token']
    if(!token) {
      return res.status(400).json({
            "status" : "error", 
            "message": "Authentication failed, token should be provided" 
        });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET)
      const text = 'SELECT * FROM users WHERE userid = $1';
      pool.query(text, [decoded.userId], (q_err,q_res)=>{
        if(!q_res.rows[0]) {
          return res.status(400).json({ 
                "status" : "error",
                "message": "User authentication failed" 
              });
        }
        req.userData = decoded;
        next();
      });

    }catch(error) {
      return res.status(401).json({
            "error":error
        });
    }
  }

  
}

export default Auth;