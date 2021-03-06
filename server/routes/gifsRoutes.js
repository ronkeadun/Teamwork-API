import express from "express";
import Gif from "../controllers/gifsControllers.js";
import auth from "../middlewares/auth";
const router = express.Router();


router.post("/gifs", auth.verifyUser, Gif.createGif)

router.delete("/gifs/:gifId", auth.verifyUser, Gif.deleteGif)

router.get("/gifs/:gifId", auth.verifyUser, Gif.viewSpecificGif)

router.get("/feeds", auth.verifyUser, Gif.viewAllGifs)

export default router;