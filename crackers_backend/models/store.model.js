module.exports = (sequelize, DataTypes) => {
	const Store = sequelize.define(
		'stores',
		{
			store_id: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			tenant_id: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			organization_id: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},

			// General Info
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			min_order_value: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
				defaultValue: 0,
			},
			online_orders_enabled: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			store_logo: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			// Lifecycle
			status: {
				type: DataTypes.ENUM('active', 'inactive', 'deleted'),
				allowNull: false,
				defaultValue: 'active',
			},
			// Feature Scalable Fields (business-specific, extendable)

			shipping_charges: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
				defaultValue: 0,
			},
			courier_charges: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: true,
				defaultValue: 0,
			},
			// Contact Info
			phone: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(100),
				allowNull: true,
				validate: { isEmail: true },
			},

			// Address Info
			address_line1: {
				type: DataTypes.STRING(150),
				allowNull: true,
			},
			address_line2: {
				type: DataTypes.STRING(150),
				allowNull: true,
			},
			city: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			state: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},
			postal_code: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			country: {
				type: DataTypes.STRING(100),
				allowNull: true,
			},

			// Flexible Configurations
			appearance: {
				type: DataTypes.JSON,
				allowNull: true,
				// { theme: "dark", logo_url: "https://..." }
			},
			notifications: {
				type: DataTypes.JSON,
				allowNull: true,
				// { email: true, sms: false, whatsapp: true }
			},
		},
		{
			paranoid: true,
			timestamps: true,
		}
	);

	return Store;
};
