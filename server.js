import express from "express";

/* Import routers */
import notionRouter from "./routes/notion.router.js";

export const app = express();
app.use(express.json());

app.use("/notion", notionRouter);

const PORT = 3000;
app.listen(PORT, () =>
	console.log(`Server running at http://localhost:${PORT}/`)
);
