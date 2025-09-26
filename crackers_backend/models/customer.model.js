module.exports = (sequelize, DataTypes) => {
	const Customer = sequelize.define(
		'customers',
		{
			customer_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			customer_code: {
				type: DataTypes.STRING,
			},
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			name: { type: DataTypes.STRING, allowNull: false },
			phone: { type: DataTypes.STRING, allowNull: true },
			email: { type: DataTypes.STRING },
			address: { type: DataTypes.TEXT },
			status: {
				type: DataTypes.ENUM('offline', 'online', 'deleted', 'active', 'inactive'),
				defaultValue: 'offline',
			},
			orders: { type: DataTypes.INTEGER, defaultValue: 0 },
			total_spent: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.0 },
			last_order: { type: DataTypes.DATE },
		},
		{
			tableName: 'customers',
			timestamps: true, // adds createdAt, updatedAt
			paranoid: true, // adds deletedAt (soft delete)
			underscored: true, // uses snake_case column names
		}
	);

	return Customer;
};
