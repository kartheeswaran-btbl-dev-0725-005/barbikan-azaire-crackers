module.exports = (sequelize, DataTypes) => {
	const StockLog = sequelize.define(
		'stock_logs',
		{
			transaction_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			product_id: { type: DataTypes.STRING, allowNull: false },
			transaction_type: {
				type: DataTypes.ENUM(
					'purchase_in', // Goods coming in from supplier
					'sale_out', // Goods sold to customer
					'sales_return_in', // Customer return (stock increases)
					'purchase_return_out', // Goods returned to supplier
					'damage_out', // Damaged/expired item
					'loss_out', // Theft/shrinkage/shortage
					'transfer_in', // Stock coming from another branch/warehouse
					'transfer_out', // Stock sent to another branch/warehouse
					'adjustment_in', // Manual stock correction (increase)
					'adjustment_out' // Manual stock correction (decrease)
				),
				allowNull: false,
			},
			quantity: { type: DataTypes.INTEGER, allowNull: false },
			reason: { type: DataTypes.TEXT, allowNull: true },
			created_by: { type: DataTypes.STRING, allowNull: false },
		},
		{
			tableName: 'stock_logs',
			timestamps: true,
			paranoid: true,
		}
	);
	StockLog.associate = (models) => {
		// Each log belongs to a product
		StockLog.belongsTo(models.Product, {
			foreignKey: 'product_id',
			as: 'product',
		});
	};
	return StockLog;
};
