import sequelize, { dbConnect } from "#config/db.js";
import { getMigrationFileUrl, listMigrationFiles } from "#utils/file.js";

import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

export async function migrate(direction = "up") {
	const umzugInstance = await createUmzug();
	try {
		if (direction === "up") {
			await umzugInstance.up();
		} else {
			await umzugInstance.down();
		}
		return true;
	} catch (err) {
		console.error("Migration failed:", err);
		process.exit(1);
	}
}

async function createUmzug() {
	await dbConnect(); // must run before using sequilize on cli
	const queryInterface = sequelize.getQueryInterface();
	return new Umzug({
		migrations: async () => {
			const files = listMigrationFiles();
			return Promise.all(
				files.map(async (file) => {
					const fileUrl = getMigrationFileUrl(file);
					const mod = await import(fileUrl);
					return {
						name: file,
						up: async () => mod.up(queryInterface, Sequelize),
						down: async () => mod.down(queryInterface, Sequelize)
					};
				})
			);
		},
		storage: new SequelizeStorage({ sequelize, tableName: "sequelize_meta" }),
		context: queryInterface,
		console: console
	});
}
