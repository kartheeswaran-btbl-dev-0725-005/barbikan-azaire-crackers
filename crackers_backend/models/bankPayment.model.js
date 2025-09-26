module.exports = (sequelize, DataTypes) => {
	const BankPayment = sequelize.define(
		'bank_payments',
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
			account_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ifsc_code: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: 'bank_payments',
			timestamps: false,
		}
	);

	BankPayment.associate = (models) => {
		BankPayment.belongsTo(models.Payment, {
			foreignKey: 'payment_id',
			as: 'payment',
		});
	};

	return BankPayment;
};
