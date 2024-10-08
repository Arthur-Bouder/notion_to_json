import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const connect = async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	if (mongoose.connection.readyState) {
		await mongoose.connection.close();
	}

	await mongoose.connect(uri);
};

export const closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoServer.stop();
};

export const clearDatabase = async () => {
	const collections = mongoose.connection.collections;

	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}
};

export const clearCollection = async (collectionName) => {
	const collection = mongoose.connection.collections[collectionName];
	await collection.deleteMany();
};
