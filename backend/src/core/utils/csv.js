import { parse } from "csv-parse/sync";
import fs from "fs";

export const readCSV = async (filePath, cast = true) => {
	try {
		const content = await fs.promises.readFile(filePath);
		return parse(content, {
			columns: true,
			skip_empty_lines: true,
			trim: true,
			cast
		});
	} catch (err) {
		throw new Error(`Failed to read CSV: ${err.message}`);
	}
};
