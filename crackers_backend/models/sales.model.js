module.exports = (sequelize, DataTypes) => {
	const Sales = sequelize.define(
		'Sale',
		{
			invoice_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },

			customer_name: { type: DataTypes.STRING, allowNull: false },
			phone: { type: DataTypes.STRING, allowNull: true },
			email: { type: DataTypes.STRING, allowNull: true },
			address: { type: DataTypes.TEXT, allowNull: true },

			date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
			total_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
			payment_method: {
				type: DataTypes.ENUM('Cash', 'UPI', 'Card'),
				defaultValue: 'Cash',
			},
			status: {
				type: DataTypes.ENUM('pending', 'paid', 'canceled'),
				defaultValue: 'pending',
			},
		},
		{ tableName: 'sales', timestamps: true, paranoid: true }
	);

	return Sales;
};
