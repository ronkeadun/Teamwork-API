import express from "express";
import User from "../controllers/usersControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();

router.post("/register-admin",  User.registerAdmin)

router.post("/create-user", auth.verifyAdmin, User.createUser)


export default router;