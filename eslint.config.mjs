import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	...compat.extends("eslint:recommended"),
	importPlugin.flatConfigs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		rules: {
			"import/order": [1, { groups: ["external", "builtin", "internal", "sibling", "parent", "index"] }]
		}
	},
	{
		ignores: ["node_modules/*", "dist/*", "build/*", ".cache/*", "*.min.js", "*.bundle.js"]
	},
	eslintConfigPrettier
];
