import { createTimestamp } from "#utils/date.js";
import { getControllerPath, getMigrationPath, getModelPath, getRouterPath, writeFile } from "#utils/file.js";

import { toPascalCase, toSnakeCase } from "#utils/string.js";
import { generateController } from "../templates/controller.js";
import { generateMigration } from "../templates/migration.js";
import { generateModel } from "../templates/model.js";
import { generateRouter } from "../templates/router.js";
import { analyze } from "./analyze.js";

export const generate = async (csvPath, tableName, options = {}) => {
	try {
		const timestamp = createTimestamp();
		const schema = await analyze(csvPath);
		const normalizedTable = toSnakeCase(tableName);
		const modelName = toPascalCase(tableName);

		const controllerContent = generateController(modelName, normalizedTable);
		const controllerFilePath = getControllerPath(normalizedTable);
		writeFile(controllerFilePath, controllerContent);

		const migrationContent = generateMigration(normalizedTable, schema);
		const migrationFilePath = getMigrationPath(normalizedTable, timestamp);
		writeFile(migrationFilePath, migrationContent);

		const modelContent = generateModel(modelName, normalizedTable, schema);
		const modelFilePath = getModelPath(normalizedTable);
		writeFile(modelFilePath, modelContent);

		const routerContent = generateRouter(modelName, normalizedTable);
		const routerFilePath = getRouterPath(normalizedTable);
		writeFile(routerFilePath, routerContent);

		console.info("autoschema.generate", `generated files for table ${normalizedTable}`);
		return true;
	} catch (err) {
		console.error("autoschema.generate failed", err);
		process.exit(1);
	}
};
