import { getProperties } from "../utils/blog.utils.js";
import {
	getBlockChildren,
	getDatabaseChildren,
} from "../utils/notion.utils.js";
import "dotenv/config";

import fs from "fs";

export const getPages = async (req, res) => {
	let result = [];

	const blocks = await getBlockChildren(process.env.NOTION_PAGE_ID);

	console.log(`Has found ${blocks.length} blog posts`);

	for (const block of blocks) {
		if (block.type !== "child_page") {
			continue;
		}
		console.log(`Formatting blog post: ${block?.child_page?.title}`);

		try {
			const blockChildren = (await getBlockChildren(block?.id)).filter(
				(child) => child.type === "child_database"
			);

			const firstChild = blockChildren[0];

			const databaseChildren = (await getDatabaseChildren(firstChild.id))
				.filter((child) => child.object === "page")
				.sort((a, b) => a.properties.order.number - b.properties.order.number);

			const parts = databaseChildren.map((dbChild) => {
				const formattedProperties = getProperties(dbChild.properties);
				return formattedProperties;
			});

			result.push({
				title: block?.child_page?.title,
				parts,
			});
		} catch (err) {
			console.log(
				`An error occurred while formatting blog post: ${block?.child_page?.title}: `,
				err
			);
		}
	}

	for (const post of result) {
		if (!fs.existsSync("blogs")) {
			fs.mkdirSync("blogs");
		}

		fs.writeFileSync(`blogs/${post.title}.json`, JSON.stringify(post, null, 2));
	}

	res.json(result);
};
