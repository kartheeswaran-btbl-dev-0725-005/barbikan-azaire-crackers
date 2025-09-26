module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define(
		'categories',
		{
			category_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			tenant_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			organization_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			group_by: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM('active', 'inactive', 'deleted'),
				defaultValue: 'active',
			},
		},
		{
			tableName: 'categories',
			timestamps: true,
			paranoid: true, // adds deletedAt
		}
	);
	Category.associate = (models) => {
		Category.hasMany(models.Product, {
			foreignKey: 'category_id',
			as: 'products',
		});
	};

	return Category;
};
