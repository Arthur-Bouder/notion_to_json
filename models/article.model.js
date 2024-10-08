import { Schema, model } from "mongoose";

const articleSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	archivedAt: {
		type: Date,
		default: null,
	},
});

export const Article = model("Article", articleSchema);
