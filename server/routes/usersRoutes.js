import express from "express";
import User from "../controllers/usersControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();

router.post("/register-admin",  User.registerAdmin)

router.post("/auth/create-user", auth.verifyAdmin, User.createUser)

router.post("/auth/signin", auth.verifyUser, User.userLogin)

router.delete("/auth/:userId", auth.verifyAdmin, User.deleteUser)

export default router;