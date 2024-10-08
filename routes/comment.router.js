import express from "express";
import {
	updateComment,
	deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
