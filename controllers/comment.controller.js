import { Article } from "../models/article.model.js";
import { Comment } from "../models/comment.model.js";
import { isCurrentUser } from "../utils/user.utils.js";

export const createComment = async (request, response) => {
	const articleId = request.params.id;
	const { content } = request.body;
	const article = await Article.findById(articleId);

	if (!article || article.archivedAt) {
		return response.status(404).send("Post not found");
	}
	if (!content) {
		return response.status(400).send("Content is required");
	}

	const comment = new Comment({
		content,
		author: request.user._id,
	});

	const createdComment = await comment.save();

	try {
		article.comments.push(createdComment._id);
		await article.save();
	} catch (err) {
		return response.status(500).send(err);
	}

	response.status(201).json(createdComment);
};

export const updateComment = async (request, response) => {
	const commentId = request.params.id;
	const { content } = request.body;
	if (!content) {
		return response.status(400).send("Content is required");
	}

	const comment = await Comment.findById(commentId).populate(
		"author",
		"-password -email"
	);
	if (!comment) {
		return response.status(404).send("Comment not found");
	}
	if (!isCurrentUser(request, comment.author._id)) {
		return response
			.status(403)
			.send("You are not allowed to update this comment");
	}

	comment.content = content;
	const updatedComment = await comment.save();
	response.status(200).json(updatedComment);
};

export const deleteComment = async (request, response) => {
	const commentId = request.params.id;
	const comment = await Comment.findById(commentId).populate(
		"author",
		"-password -email"
	);
	if (!comment) {
		return response.status(404).send("Comment not found");
	}
	if (!isCurrentUser(request, comment.author._id)) {
		return response
			.status(403)
			.send("You are not allowed to delete this comment");
	}

	await comment.deleteOne();

	response.status(200).send("Comment deleted");
};
