import assert from "assert";
import { describe, it } from "node:test";
import { cleanup } from "../commands/cleanup.js";
import { generate } from "../commands/generate.js";
import { migrate } from "../commands/migrate.js";
import { seed } from "../commands/seed.js";
import { productsCsv, transactionsCsv, usersCsv } from "./setup.js";

const TEST_CASES = [
	{ csv: productsCsv, table: "products" },
	{ csv: usersCsv, table: "users" },
	{ csv: transactionsCsv, table: "transactions" }
];

describe("Autoschema CLI Test Generate, Migrate, Import, Cleanup Commands", async () => {
	await Promise.all(
		TEST_CASES.map(async ({ csv, table }) => {
			await it(`Generate schema for ${table}`, async () => {
				const result = await generate(csv, table);
				assert.strictEqual(result, true, `Generate failed for ${table}`);
			});
		})
	);

	await it(`Run Migrations`, async () => {
		const result = await migrate();
		assert.strictEqual(result, true, "Migrate failed");
	});

	await Promise.all(
		TEST_CASES.map(async ({ csv, table }) => {
			await it(`Import data for ${table}`, async () => {
				const result = await seed(csv, table);
				assert.strictEqual(result, true, `Seed failed for ${table}`);
			});
		})
	);

	await Promise.all(
		TEST_CASES.map(async ({ table }) => {
			await it(`Cleanup ${table}`, async () => {
				const result = await cleanup(table);
				assert.strictEqual(result, true, `Cleanup failed for ${table}`);
			});
		})
	);
});
