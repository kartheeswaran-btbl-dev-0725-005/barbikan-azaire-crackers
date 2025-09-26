module.exports = (sequelize, DataTypes) => {
	const Invitation = sequelize.define(
		'invitations',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			tenant_id: { type: DataTypes.STRING, allowNull: false },
			organization_id: { type: DataTypes.STRING, allowNull: false },
			invite_email: { type: DataTypes.STRING, allowNull: false },
			invite_role: {
				type: DataTypes.ENUM('admin', 'staff', 'viewer'),
				allowNull: false,
				defaultValue: 'staff',
			},
			invite_status: {
				type: DataTypes.ENUM('pending', 'accepted', 'expired', 'revoked'),
				allowNull: false,
				defaultValue: 'pending',
			},
			invite_token: { type: DataTypes.STRING, allowNull: false, unique: true },
			invite_date: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: 'invitations',
			timestamps: true,
			underscored: true,
		}
	);

	return Invitation;
};
