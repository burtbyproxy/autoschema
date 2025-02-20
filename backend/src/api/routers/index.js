import settings from "#config/settings.js";
import { Router } from "express";
import fs from "fs";

import { pathToFileURL } from "url";

const router = Router();
const collections = [];

// find all router files in the routers directory
const files = fs.readdirSync(settings.PATH_TO_ROUTERS).filter((file) => file.endsWith(".router.js"));
for (const file of files) {
	const pathUrl = pathToFileURL(`${settings.PATH_TO_ROUTERS}/${file}`);
	console.info("Loading router file:", pathUrl.href);
	const { default: subRouter, description } = await import(pathUrl.href);
	console.info("Loaded router file:", pathUrl.href, description);
	const basePath = `/${file.replace(".router.js", "")}`;
	router.use(basePath, subRouter);
	collections.push({
		base: `${settings.API_PREFIX}${basePath}`,
		fields: description
	});
}

router.get("/", (req, res) => {
	res.json({
		collections
	});
});

export default router;
