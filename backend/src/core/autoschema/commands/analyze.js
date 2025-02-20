import { readCSV } from "#utils/csv.js";
import { toSnakeCase } from "#utils/string.js";
import { IGNORE_FIELDS } from "../constants.js";

export const analyze = async (csvPath) => {
	try {
		const records = await readCSV(csvPath, false);
		if (!records.length) {
			throw new Error("autoschema.analyze failed", "csv file is empty");
		}

		const columns = Object.keys(records[0]);
		const foundSchema = {};

		for (const key of columns) {
			const snakeKey = toSnakeCase(key);
			if (IGNORE_FIELDS.includes(snakeKey)) {
				continue;
			}
			const values = records.map((record) => record[key]);
			foundSchema[snakeKey] = _inferTypes(values);
		}

		console.info("autoschema.analyze", "successfully analyzed csv file", csvPath);
		console.table(foundSchema);
		return foundSchema;
	} catch (err) {
		console.error("autoschema.analyze failed", err);
		process.exit(1);
	}
};

const _inferTypes = (values) => {
	const nonNullValues = values.filter((v) => v !== null && v !== "");
	const allowNull = values.length !== nonNullValues.length;

	if (!nonNullValues.length) {
		return {
			type: "STRING",
			allowNull: true,
			meta: { originalType: "unknown" }
		};
	}

	if (nonNullValues.every((v) => /^(true|false|t|f|yes|no|y|n|1|0)$/i.test(String(v)))) {
		return {
			type: "BOOLEAN",
			allowNull,
			meta: { originalType: "boolean" }
		};
	}

	if (nonNullValues.every((v) => !isNaN(v))) {
		const hasDecimalIndicator = nonNullValues.some((v) => String(v).includes(".") && String(v).match(/\.\d+/));

		if (hasDecimalIndicator) {
			return {
				type: "DECIMAL",
				allowNull,
				meta: { originalType: "decimal" }
			};
		}

		// All numeric and no explicit decimal indicator
		const nums = nonNullValues.map(Number);
		const max = Math.max(...nums);
		const min = Math.min(...nums);
		if (min >= -32768 && max <= 32767) {
			return {
				type: "SMALLINT",
				allowNull,
				meta: { originalType: "integer", min, max }
			};
		}
		return {
			type: "INTEGER",
			allowNull,
			meta: { originalType: "integer", min, max }
		};
	}

	if (nonNullValues.every((v) => !isNaN(Date.parse(v)))) {
		return {
			type: "DATE",
			allowNull,
			meta: { originalType: "date" }
		};
	}

	if (
		nonNullValues.every((v) => {
			try {
				JSON.parse(v);
				return true;
			} catch {
				return false;
			}
		})
	) {
		return {
			type: "JSONB",
			allowNull,
			meta: { originalType: "json" }
		};
	}

	const maxLength = Math.max(...nonNullValues.map((v) => String(v).length));
	return {
		type: maxLength <= 255 ? "STRING" : "TEXT",
		allowNull,
		meta: {
			originalType: "string",
			maxLength,
			isLong: maxLength > 255
		}
	};
};
