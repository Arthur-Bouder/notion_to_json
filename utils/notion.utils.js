import { Client } from "@notionhq/client";
import "dotenv/config";

export const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});

export const getBlockChildren = async (blockId) => {
	const block = await notion.blocks.children.list({
		block_id: blockId,
	});

	return block.results;
};

export const getDatabaseChildren = async (databaseId) => {
	const database = await notion.databases.query({
		database_id: databaseId,
	});

	return database.results;
};
