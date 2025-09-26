module.exports = (sequelize, DataTypes) => {
	const Quotation = sequelize.define(
		'Quotation',
		{
			quotation_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			invoice_id: { type: DataTypes.STRING, allowNull: true },
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			customer_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			valid_until: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			notes: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			total_amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('draft', 'paid', 'deleted'),
				defaultValue: 'draft',
			},
		},
		{
			tableName: 'quotations',
			timestamps: true,
			paranoid: true,
		}
	);

	Quotation.associate = (models) => {
		Quotation.hasMany(models.QuotationItem, {
			foreignKey: 'quotation_id',
			as: 'items',
		});
	};

	return Quotation;
};
