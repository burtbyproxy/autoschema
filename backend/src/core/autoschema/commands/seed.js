import sequelize, { dbConnect } from "#config/db.js";
import { readCSV } from "#utils/csv.js";
import { toSnakeCase } from "#utils/string.js";
import { IGNORE_FIELDS } from "../constants.js";

export async function seed(csvPath, tableName, options = {}) {
	await dbConnect(); // ensure DB connection is established
	await sequelize.sync(); // make sure models are synced

	try {
		console.info("Seeding table", tableName, csvPath, options);
		const modelName = Object.keys(sequelize.models).find((name) => name.toLowerCase() === tableName.toLowerCase());
		const model = sequelize.models[modelName];
		if (!model) {
			console.error(`Error: Table "${tableName}" not found in Sequelize models.`);
			process.exit(1);
		}

		const records = await readCSV(csvPath, true);
		if (!records.length) {
			console.log("No data found in CSV.");
			return;
		}
		if (options.dryRun) {
			console.table(records);
			console.log("Dry run complete. No data inserted.");
			return;
		}

		const modelAttributes = Object.keys(model.rawAttributes);
		const recordsFormatted = records.map((record) => {
			const newRecord = {};
			for (const key in record) {
				const snakeKey = toSnakeCase(key);
				if (IGNORE_FIELDS.includes(snakeKey)) {
					continue;
				}
				if (!modelAttributes.includes(snakeKey)) {
					console.warn(`Column "${snakeKey}" not found in table "${tableName}"`);
					continue;
				}
				try {
					newRecord[snakeKey] = _sanitizeFieldValue(model, snakeKey, record[key]);
				} catch (error) {
					console.warn(`Error sanitizing field "${snakeKey}": ${error.message}`);
					continue;
				}
			}
			console.info("newRecord", newRecord);
			return newRecord;
		});

		await model.bulkCreate(recordsFormatted, { validate: true });
		console.info("autoschema.seed", `Seed completed for table ${tableName}`);
		return true;
	} catch (error) {
		console.error("Import failed:", error);
		process.exit(1);
	}
}

function _sanitizeFieldValue(model, key, value) {
	const attribute = model.rawAttributes[key];
	if (!attribute) return value;

	const dataType = attribute.type.toString().toUpperCase();

	if (value === "" || value === null || value === undefined) {
		if (attribute.allowNull === false) {
			throw new Error(`Field "${key}" cannot be null`);
		}
		return null;
	}

	if (dataType.includes("INTEGER") || dataType.includes("BIGINT")) {
		const parsed = parseInt(value, 10);
		return isNaN(parsed) ? null : parsed;
	}
	if (
		dataType.includes("FLOAT") ||
		dataType.includes("DOUBLE") ||
		dataType.includes("DECIMAL") ||
		dataType.includes("REAL")
	) {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? null : parsed;
	}

	if (dataType.includes("BOOLEAN")) {
		if (typeof value === "string") {
			const lowered = value.toLowerCase();
			if (["true", "1", "yes"].includes(lowered)) return true;
			if (["false", "0", "no"].includes(lowered)) return false;
		}
		return Boolean(value);
	}

	if (dataType.includes("DATE") || dataType.includes("TIMESTAMP")) {
		const date = new Date(value);
		return isNaN(date.getTime()) ? null : date;
	}

	if (dataType.includes("JSON")) {
		if (typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		}
		return value;
	}

	return String(value);
}
