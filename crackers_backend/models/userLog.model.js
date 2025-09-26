module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_logs', {
		tenant_user_id: { type: DataTypes.STRING, allowNull: false },
		tenant_id: { type: DataTypes.STRING, allowNull: false },
		organization_id: { type: DataTypes.STRING, allowNull: false },
		action: { type: DataTypes.STRING },
		description: { type: DataTypes.TEXT },
		metadata: { type: DataTypes.JSON },
	});
};
