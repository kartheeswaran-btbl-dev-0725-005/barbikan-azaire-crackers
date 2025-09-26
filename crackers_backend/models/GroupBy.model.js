module.exports = (sequelize, DataTypes) => {
	const GroupBy = sequelize.define(
		'group_by',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			tenant_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			organization_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			group_by: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('active', 'inactive', 'deleted'),
				defaultValue: 'active',
			},
		},
		{
			tableName: 'group_by',
			timestamps: true,
			paranoid: true, // soft delete enabled
		}
	);

	// // Associations (if needed later)
	// GroupBy.associate = (models) => {
	// 	// Example: GroupBy.hasMany(models.Category, { foreignKey: 'group_by_id' });
	// };

	return GroupBy;
};
