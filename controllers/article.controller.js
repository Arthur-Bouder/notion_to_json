import { Article } from "../models/article.model.js";
import { isCurrentUser } from "../utils/user.utils.js";

export const getArticles = async (req, res) => {
	const articles = await Article.find({
		archivedAt: null,
	})
		.populate("author", "-password -email")
		.populate({
			path: "comments",
			populate: {
				path: "author",
				select: "-password -email",
			},
		});

	res.status(200).json(articles);
};

export const getArticle = async (req, res) => {
	const articleId = req.params.id;
	const article = await Article.findById(articleId)
		.populate("author", "-password -email")
		.populate({
			path: "comments",
			populate: {
				path: "author",
				select: "-password -email",
			},
		});

	if (!article) {
		return res.status(404).send("Article not found");
	}

	res.status(200).json(article);
};

export const createArticle = async (req, res) => {
	const { title, content } = req.body;

	if (!title || !content) {
		return res.status(400).send("Title and content are required");
	}

	const newArticle = new Article({
		title,
		content,
		comments: [],
		author: req.user._id,
	});

	const savedArticle = await newArticle.save();

	res.status(201).json(savedArticle);
};

export const updateArticle = async (req, res) => {
	const articleId = req.params.id;
	const { title, content } = req.body;

	const article = await Article.findById(articleId).populate(
		"author",
		"-password -email"
	);

	if (!article) {
		return res.status(404).send("Article not found");
	}

	if (!isCurrentUser(req, article.author._id)) {
		return res.status(403).send("You are not allowed to update this article");
	}

	const updatedArticle = await Article.findByIdAndUpdate(
		articleId,
		{ title, content },
		{ new: true }
	);

	res.status(200).json(updatedArticle);
};

export const softDeleteArticle = async (req, res) => {
	const articleId = req.params.id;

	const article = await Article.findById(articleId).populate(
		"author",
		"-password -email"
	);

	if (!article) {
		return res.status(404).send("Article not found");
	}

	if (!isCurrentUser(req, article.author._id)) {
		return res.status(403).send("You are not allowed to delete this article");
	}

	await Article.findByIdAndUpdate(
		articleId,
		{
			archivedAt: new Date(),
		},
		{
			new: true,
		}
	);

	res.status(200).json("Article deleted");
};
