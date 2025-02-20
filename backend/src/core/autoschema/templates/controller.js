export const generateController = (modelName, tableName) => {
	return `import ${modelName} from "#domain/models/${tableName}.model.js";

export const ${modelName}Controller = {
	getAll: async (req, res) => {
		try {
			const recordset = await ${modelName}.findAll();
			res.json(recordset);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	create: async (req, res) => {
		try {
			const record = await ${modelName}.create(req.body);
			res.status(201).json(record);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	},
	getById: async (req, res) => {
		try {
			const record = await ${modelName}.findByPk(req.params.id);
			if (!record) return res.status(404).json({ error: "${modelName} record not found" });
			res.json(record);
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
	update: async (req, res) => {
		try {
			const record = await ${modelName}.findByPk(req.params.id);
			if (!record) return res.status(404).json({ error: "${modelName} record not found" });
			await record.update(req.body);
			res.json(record);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	},
	delete: async (req, res) => {
		try {
			const record = await ${modelName}.findByPk(req.params.id);
			if (!record) return res.status(404).json({ error: "${modelName} record not found" });
			await record.destroy();
			res.status(204).send();
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	}
};
`;
};
