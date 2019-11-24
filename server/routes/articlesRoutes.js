import express from "express";
import Article from "../controllers/articlesControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();


router.post("/articles", auth.verifyUser, Article.createArticle)


export default router;