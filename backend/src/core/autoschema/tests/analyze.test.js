import assert from "assert";
import { describe, it } from "node:test";
import { productsCsv, transactionsCsv, usersCsv } from "./setup.js";

import { analyze } from "../commands/analyze.js";

const TEST_CASES = [
	{ csv: productsCsv, table: "products" },
	{ csv: usersCsv, table: "users" },
	{ csv: transactionsCsv, table: "transactions" }
];

describe("Autoschema CLI Test Analyze Command", async () => {
	await Promise.all(
		TEST_CASES.map(async ({ csv }) => {
			await it(`🔍 Analyze ${csv}`, async () => {
				const result = await analyze(csv);
				assert.strictEqual(Array.isArray(result), true, `Analyze failed for ${csv}`);
			});
		})
	);
});
