import express from "express";
import User from "../controllers/usersControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();

router.post("/register-admin",  User.registerAdmin)

router.post("/create-user", auth.verifyAdmin, User.createUser)

router.post("/signin", auth.verifyUser, User.userLogin)

router.delete("/:userId", auth.verifyAdmin, User.deleteUser)

export default router;