import settings from "#config/settings.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const ensureDirectoryExists = (dirPath) => {
	fs.mkdirSync(dirPath, { recursive: true });
};

export const getModelPath = (tableName) => {
	ensureDirectoryExists(settings.PATH_TO_MODELS);
	return path.join(settings.PATH_TO_MODELS, `${tableName}.model.js`);
};

export const getMigrationPath = (tableName, timestamp) => {
	ensureDirectoryExists(settings.PATH_TO_MIGRATIONS);
	return path.join(settings.PATH_TO_MIGRATIONS, `${timestamp}_create_${tableName}.js`);
};

export const getRouterPath = (tableName) => {
	ensureDirectoryExists(settings.PATH_TO_ROUTERS);
	return path.join(settings.PATH_TO_ROUTERS, `${tableName}.router.js`);
};

export const getControllerPath = (tableName) => {
	ensureDirectoryExists(settings.PATH_TO_CONTROLLERS);
	return path.join(settings.PATH_TO_CONTROLLERS, `${tableName}.controller.js`);
};

export const getMigrationFileUrl = (filename) => {
	const fullPath = path.join(settings.PATH_TO_MIGRATIONS, filename);
	return pathToFileURL(fullPath).href;
};

export const writeFile = (filePath, content) => {
	fs.writeFileSync(filePath, content);
};

export const removeFile = (filePath) => {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		return true;
	}
	return false;
};

export const listMigrationFiles = () => {
	return fs.readdirSync(settings.PATH_TO_MIGRATIONS).filter((file) => file.endsWith(".js"));
};

export const findControllerFiles = (tableName) => {
	const files = fs.readdirSync(settings.PATH_TO_CONTROLLERS);
	return files.filter((file) => file.includes(`${tableName}.controller`));
};

export const removeControllerFiles = (tableName) => {
	const removed = [];
	const files = findControllerFiles(tableName);
	for (const file of files) {
		const filePath = file ? path.join(settings.PATH_TO_CONTROLLERS, file) : null;
		if (filePath && removeFile(filePath)) {
			removed.push(filePath);
		}
	}
	return removed;
};

export const findModelFiles = (tableName) => {
	const files = fs.readdirSync(settings.PATH_TO_MODELS);
	return files.filter((file) => file.includes(`${tableName}.model`));
};

export const removeModelFiles = (tableName) => {
	const removed = [];
	const files = findModelFiles(tableName);
	for (const file of files) {
		const filePath = file ? path.join(settings.PATH_TO_MODELS, file) : null;
		if (filePath && removeFile(filePath)) {
			removed.push(filePath);
		}
	}
	return removed;
};

export const findMigrationFiles = (tableName) => {
	const files = fs.readdirSync(settings.PATH_TO_MIGRATIONS);
	return files.filter((file) => file.includes(`create_${tableName}`));
};

export const removeMigrationFiles = (tableName) => {
	const removed = [];
	const files = findMigrationFiles(tableName);
	for (const file of files) {
		const filePath = file ? path.join(settings.PATH_TO_MIGRATIONS, file) : null;
		if (filePath && removeFile(filePath)) {
			removed.push(filePath);
		}
	}
	return removed;
};

export const findRouterFiles = (tableName) => {
	const files = fs.readdirSync(settings.PATH_TO_ROUTERS);
	return files.filter((file) => file.includes(`${tableName}.router`));
};

export const removeRouterFiles = (tableName) => {
	const removed = [];
	const files = findRouterFiles(tableName);
	for (const file of files) {
		const filePath = file ? path.join(settings.PATH_TO_ROUTERS, file) : null;
		if (filePath && removeFile(filePath)) {
			removed.push(filePath);
		}
	}
	return removed;
};
