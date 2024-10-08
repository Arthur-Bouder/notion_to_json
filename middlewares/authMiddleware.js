import jwt from "jsonwebtoken";

export const jwtSecret = "s3cr3t";

export const authMiddleware = (request, response, next) => {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		return response.status(401).send("Unauthorized");
	}

	// Remove the "Bearer" prefix from the token
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return response.status(401).send("Unauthorized");
	}

	jwt.verify(token, jwtSecret, (error, decodedToken) => {
		if (error) {
			return response.status(401).send("Unauthorized");
		}

		request.user = decodedToken;
		next();
	});
};
