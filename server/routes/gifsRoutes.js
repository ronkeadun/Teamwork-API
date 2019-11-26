import express from "express";
import Gif from "../controllers/gifsControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();


router.post("/gifs", auth.verifyUser, Gif.createGif)

/*router.patch("/articles/:articleId", auth.verifyUser, Article.editGif)

router.delete("/articles/:articleId", auth.verifyUser, Article.deleteGif)*/


export default router;