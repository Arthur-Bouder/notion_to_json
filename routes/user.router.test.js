import { expect } from "chai";
import supertest from "supertest";

import {
	connect,
	closeDatabase,
	clearDatabase,
	clearCollection,
} from "../utils/db.utils.js";
import { app } from "../server.js";

const request = supertest(app);

let headers = {};

describe("Articles routes", () => {
	before(async () => {
		// Connect to the local database
		await connect();

		// Register a user and store the token in the headers
		const response = await request.post("/users/register").send({
			email: "admin",
			password: "admin",
			username: "admin",
		});
		const token = response.body.token;

		headers = {
			Authorization: `Bearer ${token}`,
		};
	});

	// Close the database connection after all tests are done
	after(async () => {
		await clearDatabase();
		await closeDatabase();
	});

	// Clear the articles and comments collections after each test
	afterEach(async () => {
		await clearCollection("articles");
		await clearCollection("comments");
	});

	it("Should return 401 if no token is provided", async () => {
		const response = await request.post("/articles");

		expect(response.status).to.equal(401);
		expect(response.text).to.equal("Unauthorized");
	});

	describe("GET routes", () => {
		it("GET /articles", async () => {
			const getResponse = await request.get("/articles").set(headers);

			expect(getResponse.body).to.be.an("array");
			expect(getResponse.body.length).to.equal(0);
			expect(getResponse.status).to.equal(200);
		});

		it("GET /articles/:id", async () => {
			const articleResponse = await request
				.post("/articles")
				.set(headers)
				.send({
					title: "Test",
					content: "Test",
				});

			const articleId = articleResponse.body._id;

			const response = await request.get(`/articles/${articleId}`).set(headers);

			expect(response.body.title).to.equal("Test");
			expect(response.body.content).to.equal("Test");
		});
	});

	describe("POST routes", () => {
		it("POST /articles", async () => {
			const response = await request.post("/articles").set(headers).send({
				title: "Test",
				content: "Test",
			});

			expect(response.status).to.equal(201);

			const getResponse = await request.get("/articles").set(headers);

			expect(getResponse.body.length).to.equal(1);
			expect(getResponse.body[0].title).to.equal("Test");
		});

		it("Missing title or content should return 400", async () => {
			const response = await request.post("/articles").set(headers).send({
				title: "Test",
			});

			expect(response.status).to.equal(400);
			expect(response.text).to.equal("Title and content are required");
		});
	});

	describe("DELETE routes", () => {
		it("DELETE /articles/:id", async () => {
			const articleResponse = await request
				.post("/articles")
				.set(headers)
				.send({
					title: "Test",
					content: "Test",
				});

			const articleId = articleResponse.body._id;

			const response = await request
				.delete(`/articles/${articleId}`)
				.set(headers);

			expect(response.status).to.equal(200);

			const getResponse = await request.get("/articles").set(headers);
			expect(getResponse.body.length).to.equal(0);
		});

		it("Should return 404 if the article does not exist", async () => {
			const response = await request
				.delete("/articles/67058b48e31c85284a413289")
				.set(headers);

			expect(response.status).to.equal(404);
			expect(response.text).to.equal("Article not found");
		});
	});
});
