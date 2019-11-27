import express from "express";
import Article from "../controllers/articlesControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();


router.post("/articles", auth.verifyUser, Article.createArticle)

router.patch("/articles/:articleId", auth.verifyUser, Article.editArticle)

router.delete("/articles/:articleId", auth.verifyUser, Article.deleteArticle)

router.get("/articles/:articleId", auth.verifyUser, Article.viewSpecificArticle)


export default router;