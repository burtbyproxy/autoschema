export const generateRouter = (modelName, tableName) => {
	return `import ${modelName} from "#domain/models/${tableName}.model.js";
import { ${modelName}Controller } from "#api/controllers/${tableName}.controller.js";
import { authenticateApiKey } from "#api/middleware/auth.js";
import { Router } from "express";
const router = Router();
router.use(authenticateApiKey);
router.get("/", ${modelName}Controller.getAll);
router.post("/", ${modelName}Controller.create);
router.get("/:id", ${modelName}Controller.getById);
router.put("/:id", ${modelName}Controller.update);
router.delete("/:id", ${modelName}Controller.delete);
export default router;
export const description = await ${modelName}.describe();
`;
};
