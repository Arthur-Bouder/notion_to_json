import express from "express";
import { getPages } from "../controllers/notion.controller.js";

const router = express.Router();

router.get("/", getPages);

router.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong!");
});

export default router;
