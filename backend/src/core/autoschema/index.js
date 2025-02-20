import { program } from "commander";
import { analyze } from "./commands/analyze.js";
import { cleanup } from "./commands/cleanup.js";
import { generate } from "./commands/generate.js";
import { migrate } from "./commands/migrate.js";
import { seed } from "./commands/seed.js";

program.command("analyze <csvPath>").description("Analyze CSV structure and suggest schema").action(analyze);
program
	.command("process <csvPath>")
	.description("Process CSV file to import its data, automatically generating models and routes.")
	.action(async (csvPath) => {
		try {
			const tableName = csvPath.split("/").pop().split(".")[0];
			await generate(csvPath, tableName, { force: true });
			await migrate("up");
			await seed(csvPath, tableName, {});
		} catch (err) {
			await cleanup(tableName);
			console.error("autoschema.process failed", err);
			process.exit(1);
		}
	});

program
	.command("generate <csvPath> <tableName>")
	.description("Generate model and migration")
	.option("-f, --force", "Override existing files")
	.action(generate);

program
	.command("migrate")
	.description("Run pending migrations")
	.option("-d, --down", "Reverse last migration")
	.action(async (options) => {
		try {
			await migrate(options.down ? "down" : "up");
		} catch (err) {
			console.error("autoschema.migrate failed", err);
			process.exit(1);
		}
	});

program
	.command("seed <csvPath> <tableName>")
	.description("Import CSV data into table")
	.option("-d, --dry-run", "Show what would be imported")
	.action(async (csvPath, tableName, options) => {
		try {
			await seed(csvPath, tableName, options);
		} catch (err) {
			console.error("autoschema.seed failed", err);
			process.exit(1);
		}
	});

program
	.command("cleanup <tableName>")
	.description("Remove generated model and migration files for a table")
	.action(async (tableName) => {
		try {
			await cleanup(tableName);
		} catch (err) {
			console.error("autoschema.cleanup failed", err);
			process.exit(1);
		}
	});

program.parse();
