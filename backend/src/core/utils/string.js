export const toSnakeCase = (str) => {
	return str
		.toLowerCase()
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "")
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");
};

export const toPascalCase = (str) => {
	return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^(.)/, (c) => c.toUpperCase());
};

export const toCamelCase = (str) => {
	const pascal = toPascalCase(str);
	return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};
