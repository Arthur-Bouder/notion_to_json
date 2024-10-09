import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "./middlewares/authMiddleware.js";

/* Import routers */
import userRouter from "./routes/user.router.js";
import articleRouter from "./routes/article.router.js";
import commentRouter from "./routes/comment.router.js";

export const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/articles", articleRouter);

// Protect further routes with authMiddleware
app.use(authMiddleware);

app.use("/comments", commentRouter);

const PORT = 3000;
const dbUrl = "mongodb+srv://admin:admin@supinfo.geyhi.mongodb.net/blogs";
mongoose.connect(dbUrl).then((result) => {
	console.log("Connected to database");
	app.listen(PORT, () =>
		console.log(`Server running at http://localhost:${PORT}/`)
	);
});
