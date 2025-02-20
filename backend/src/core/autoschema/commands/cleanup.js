import sequelize, { dbConnect } from "#config/db.js";
import { removeControllerFiles, removeMigrationFiles, removeModelFiles, removeRouterFiles } from "#utils/file.js";

import { toSnakeCase } from "#utils/string.js";

export const cleanup = async (tableName) => {
	await dbConnect(); // must run before using sequilize on cli
	const normalizedTable = toSnakeCase(tableName);
	try {
		const removedFiles = _cleanupFiles(normalizedTable);
		if (removedFiles.length === 0) {
			console.warn("autoschema.cleanup", `no files found for table ${normalizedTable}`);
			return;
		}
		console.info("autoschema.cleanup", `removed files for table ${normalizedTable}`, removedFiles);
	} catch (err) {
		console.error("autoschema.cleanup", `cleanup failed on files for table ${normalizedTable}`, err);
		process.exit(1);
	}

	try {
		await sequelize.getQueryInterface().dropTable(tableName);
		console.info("autoschema.cleanup", `dropped table ${tableName}`);
	} catch (err) {
		console.error("autoschema.cleanup", `failed to drop table ${tableName}`, err);
		process.exit(1);
	}
	console.info("autoschema.cleanup", `successfully cleaned up table ${normalizedTable}`);
	return true;
};

const _cleanupFiles = (tableName) => {
	const removedControllerFiles = removeControllerFiles(tableName);
	const removedModelFiles = removeModelFiles(tableName);
	const removedMigrationFiles = removeMigrationFiles(tableName);
	const removedRouterFiles = removeRouterFiles(tableName);
	const removedFiles = [
		...removedControllerFiles,
		...removedModelFiles,
		...removedMigrationFiles,
		...removedRouterFiles
	];
	if (removedFiles.length === 0) {
		console.warn("autoschema.cleanup", `No model/migration files found for ${tableName}`);
	}
	return removedFiles;
};
