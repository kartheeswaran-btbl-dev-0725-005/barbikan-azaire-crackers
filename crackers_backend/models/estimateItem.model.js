module.exports = (sequelize, DataTypes) => {
	const EstimateItem = sequelize.define(
		'EstimateItem',
		{
			item_id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
			estimate_id: { type: DataTypes.STRING, allowNull: false },

			product_id: { type: DataTypes.STRING, allowNull: false },
			name: { type: DataTypes.STRING, allowNull: false },
			quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
			price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
			subtotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
		},
		{ tableName: 'estimate_items', timestamps: true, paranoid: true }
	);

	EstimateItem.associate = (models) => {
		EstimateItem.belongsTo(models.Estimate, {
			foreignKey: 'estimate_id',
			as: 'estimate',
		});
	};

	return EstimateItem;
};
