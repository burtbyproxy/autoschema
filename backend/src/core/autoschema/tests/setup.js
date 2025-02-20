import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Get absolute path to `tests/data/`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const TEST_DATA_DIR = path.join(__dirname, "data");

// Paths to CSV files
export const productsCsv = path.join(TEST_DATA_DIR, "products.csv");
export const usersCsv = path.join(TEST_DATA_DIR, "users.csv");
export const transactionsCsv = path.join(TEST_DATA_DIR, "transactions.csv");

export const runCommand = (command, args = "") => {
	try {
		return execSync(`node scripts/autoschema/index.js ${command} ${args}`, {
			stdio: "pipe",
			encoding: "utf-8"
		});
	} catch (err) {
		return err.stdout || err.stderr;
	}
};
