module.exports = (sequelize, DataTypes) => {
	const TenantUser = sequelize.define(
		'tenant_users',
		{
			user_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			role: {
				type: DataTypes.ENUM('owner', 'admin', 'manager', 'staff', 'viewer'),
				allowNull: false,
				defaultValue: 'viewer',
			},
			permissions: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: ['*'],
			},
			updated_by: { type: DataTypes.STRING },
		},
		{
			tableName: 'tenant_users',
			timestamps: true,
			underscored: true,
			indexes: [
				{
					// 🔒 employee_id must be unique **within a tenant** (across all orgs)
					unique: true,
					fields: ['tenant_id', 'user_id'],
				},
			],
		}
	);

	return TenantUser;
};
