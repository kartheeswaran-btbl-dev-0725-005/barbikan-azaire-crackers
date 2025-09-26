module.exports = (sequelize, DataTypes) => {
	const UpiPayment = sequelize.define(
		'upi_payments',
		{
			payment_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			bank_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			upi_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			qr_code: {
				type: DataTypes.TEXT, // file path or filename
				allowNull: false,
			},
		},
		{
			tableName: 'upi_payments',
			timestamps: false,
		}
	);

	UpiPayment.associate = (models) => {
		UpiPayment.belongsTo(models.Payment, {
			foreignKey: 'payment_id',
			as: 'payment',
		});
	};

	return UpiPayment;
};
