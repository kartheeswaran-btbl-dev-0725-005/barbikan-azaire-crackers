module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define(
		'organizations',
		{
			tenant_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			organization_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
		},
		{
			tableName: 'organizations',
			timestamps: true, // adds createdAt, updatedAt
			underscored: true, // uses snake_case column names
		}
	);

	return Organization;
};
