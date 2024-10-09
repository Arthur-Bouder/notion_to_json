import express from "express";
import {
	getArticles,
	getArticle,
	createArticle,
	updateArticle,
	softDeleteArticle,
} from "../controllers/article.controller.js";
import { createComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getArticles);
router.get("/:id", getArticle);

// Protect further routes with authMiddleware
router.use(authMiddleware);

router.post("/", createArticle);
router.patch("/:id", updateArticle);

router.delete("/:id", softDeleteArticle);

router.post("/:id/comment", createComment);

router.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
});

export default router;
