import settings from "#config/settings.js";
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { pathToFileURL } from "url";

const dbConfig = {
	host: settings.DB_HOST,
	port: settings.DB_PORT,
	username: settings.POSTGRES_USER,
	password: settings.POSTGRES_PASSWORD,
	database: settings.POSTGRES_DB
};

const sequelize = new Sequelize({
	dialect: "postgres",
	...dbConfig
});

export const dbConnect = async () => {
	try {
		await sequelize.authenticate();
		console.debug("Database connected");
		await _registerModels();
		await sequelize.sync();
	} catch (err) {
		console.error("Database connection failed:", err);
		throw err;
	}
};

const _registerModels = async () => {
	try {
		const files = fs.readdirSync(settings.PATH_TO_MODELS).filter((file) => file.endsWith(".model.js"));
		for (const file of files) {
			const modelPath = pathToFileURL(path.join(settings.PATH_TO_MODELS, file)).href;
			const { default: model } = await import(modelPath);
			if (model) {
				sequelize.models[model.name] = model;
			}
		}
		return sequelize.models;
	} catch (err) {
		console.error("Failed to register models:", err);
		throw err;
	}
};

export default sequelize;
