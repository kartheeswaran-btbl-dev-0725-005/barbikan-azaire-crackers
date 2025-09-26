module.exports = (sequelize, DataTypes) => {
	const Estimate = sequelize.define(
		'Estimate',
		{
			estimate_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			estimate_code: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			// invoice_id: { type: DataTypes.STRING, allowNull: true },
			customer_name: { type: DataTypes.STRING, allowNull: false },
			phone: { type: DataTypes.STRING, allowNull: true },
			email: { type: DataTypes.STRING, allowNull: true },
			address: { type: DataTypes.TEXT, allowNull: true },
			state: { type: DataTypes.STRING, allowNull: true },
			city: { type: DataTypes.STRING, allowNull: true },
			postal_code: { type: DataTypes.STRING, allowNull: true },

			message: { type: DataTypes.TEXT, allowNull: true },
			priority: {
				type: DataTypes.ENUM('low', 'medium', 'high'),
				defaultValue: 'medium',
			},
			status: {
				type: DataTypes.ENUM(
					'new',
					'contacted',
					'paid',
					'couriered',
					'delivered',
					'canceled',
					'refunded',
					'deleted'
				),
				defaultValue: 'new',
			},
			notes: { type: DataTypes.TEXT, allowNull: true },

			total_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
			discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
			total_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
		},
		{
			tableName: 'estimates',
			timestamps: true,
			paranoid: true,
			indexes: [
				{
					unique: true,
					fields: ['organization_id', 'estimate_code'],
				},
			],
		}
	);

	Estimate.associate = (models) => {
		Estimate.hasMany(models.EstimateItem, {
			foreignKey: 'estimate_id',
			as: 'items',
		});
	};

	return Estimate;
};
