module.exports = (sequelize, DataTypes) => {
	const QuotationItem = sequelize.define(
		'QuotationItem',
		{
			item_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			quotation_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			product_id: { type: DataTypes.STRING, allowNull: false },
			product_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			total: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
		},
		{
			tableName: 'quotation_items',
			timestamps: true,
			paranoid: true,
		}
	);

	QuotationItem.associate = (models) => {
		QuotationItem.belongsTo(models.Quotation, {
			foreignKey: 'quotation_id',
			as: 'quotation',
		});
	};

	return QuotationItem;
};
