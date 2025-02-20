import dotenv from "dotenv";
dotenv.config({
	path: "../.env"
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiSettings = {
	API_PORT: process.env.API_PORT || 3000,
	API_PREFIX: process.env.API_PREFIX || "/api"
};

const secrets = {
	API_KEYS: new Set(process.env.API_KEYS?.split(",") || []),
	JWT_SECRET: process.env.JWT_SECRET || "fallback-secret"
};

const dbSettings = {
	POSTGRES_USER: process.env.POSTGRES_USER,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_DB: process.env.POSTGRES_DB,
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_PORT: process.env.DB_PORT || 5432
};

const pathSettings = {
	PATH_TO_MIGRATIONS: path.join(__dirname, "../../domain/migrations"),
	PATH_TO_MODELS: path.join(__dirname, "../../domain/models"),
	PATH_TO_SEEDERS: path.join(__dirname, "../../domain/seeders"),
	PATH_TO_CONTROLLERS: path.join(__dirname, "../../api/controllers"),
	PATH_TO_ROUTERS: path.join(__dirname, "../../api/routers")
};

export default {
	ENV: process.env.NODE_ENV || "development",
	...secrets,
	...dbSettings,
	...pathSettings,
	...apiSettings
};
