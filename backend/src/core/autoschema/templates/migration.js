export const generateMigration = (tableName, schema) => {
	return `export const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable('${tableName}', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
${Object.entries(schema)
	.map(([column, type]) => {
		return `        ${column}: {
            type: Sequelize.${type.type},
            allowNull: ${type.allowNull}
        }`;
	})
	.join(",\n")},
        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false
        }
    });
};

export const down = async (queryInterface) => {
    await queryInterface.dropTable('${tableName}');
};`;
};
