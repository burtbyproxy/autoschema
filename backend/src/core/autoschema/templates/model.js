export const generateModel = (modelName, tableName, schema) => {
	return `import sequelize from "#config/db.js";
import { DataTypes, Model } from "sequelize";

class ${modelName} extends Model {}

${modelName}.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
${Object.entries(schema)
	.map(([column, type]) => {
		return `        ${column}: {
            type: DataTypes.${type.type},
            allowNull: ${type.allowNull}
        }`;
	})
	.join(",\n")}
    },
    {
        sequelize,
        modelName: '${modelName}',
        tableName: '${tableName}',
        timestamps: true,
        underscored: true
    }
);

export default ${modelName};
`;
};
