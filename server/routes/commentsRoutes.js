import express from "express";
import Comment from "../controllers/commentsControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();


router.post("/articles/:articleId/comment", auth.verifyUser, Comment.createArticleComment)

router.post("/gifs/:gifId/comment", auth.verifyUser, Comment.createGifComment)


export default router;