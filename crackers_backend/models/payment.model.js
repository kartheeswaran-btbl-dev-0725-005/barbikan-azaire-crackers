module.exports = (sequelize, DataTypes) => {
	const Payment = sequelize.define(
		'payments',
		{
			payment_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			tenant_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			organization_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM('bank_transfer', 'upi'),
				allowNull: false,
			},
			account_owner: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bank_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM('active', 'inactive', 'deleted'),
				defaultValue: 'active',
			},
			// Bank fields
			account_number: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			ifsc_code: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			// UPI fields
			upi_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			qr_code: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			tableName: 'payments',
			timestamps: true,
			paranoid: true, // soft delete
		}
	);

	return Payment;
};
