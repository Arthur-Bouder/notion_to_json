import { Schema, model } from "mongoose";

const commentSchema = new Schema({
	content: {
		type: String,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

export const Comment = model("Comment", commentSchema);
