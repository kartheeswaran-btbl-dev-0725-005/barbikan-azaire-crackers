module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		'products',
		{
			product_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			product_code: { type: DataTypes.STRING, allowNull: true },
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			category_id: { type: DataTypes.STRING, allowNull: false },
			name: { type: DataTypes.STRING, allowNull: false },
			price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
			discount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
			pack_content: { type: DataTypes.STRING, allowNull: false },
			stock_quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			unit_type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			minimum_stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			maximum_stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.ENUM('active', 'inactive', 'deleted'),
				defaultValue: 'active',
			},
			description: { type: DataTypes.TEXT, allowNull: true },
			images: { type: DataTypes.JSON, allowNull: true },
		},
		{
			tableName: 'products',
			timestamps: true,
			paranoid: true,
		}
	);
	Product.associate = (models) => {
		// A product belongs to one category
		Product.belongsTo(models.Category, {
			foreignKey: 'category_id',
			as: 'category',
		});

		// A product has many stock logs
		Product.hasMany(models.StockLog, {
			foreignKey: 'product_id',
			as: 'stock_logs',
		});
	};
	return Product;
};
