export const toRetrieveProperties = [
	{ slug: "type", value: (object) => object.select.name },
	{ slug: "title", value: (object) => object?.rich_text[0]?.text?.content },
	{
		slug: "description",
		value: (object) => object?.rich_text[0]?.text?.content,
	},
	{
		slug: "picture_path",
		value: (object) => object?.rich_text[0]?.text?.content,
	},
	{ slug: "text", value: (object) => object?.rich_text[0]?.text?.content },
];

export const getProperties = (pageProperties) => {
	const properties = {};

	for (const property of toRetrieveProperties) {
		const value = pageProperties[property.slug];
		properties[property.slug] = property.value(value);
	}

	return properties;
};
