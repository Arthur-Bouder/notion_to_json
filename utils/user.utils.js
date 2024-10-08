export const isCurrentUser = (req, userId) => {
	const stringUserId = typeof userId === "object" ? userId.toString() : userId;
	return req.user._id === stringUserId;
};
