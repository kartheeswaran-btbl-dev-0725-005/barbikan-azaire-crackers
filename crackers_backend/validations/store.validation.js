const Joi = require('joi');

// Create Store Schema
exports.createStoreSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),

	// General Info
	name: Joi.string().required(),
	description: Joi.string().allow(null, '').max(255),
	min_order_value: Joi.number().min(0).default(0),
	online_orders_enabled: Joi.boolean().default(false),
	store_logo: Joi.string().allow(null, ''),

	// Lifecycle
	status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),

	// Feature Scalable Fields
	courier_charges: Joi.number().min(0).default(0),
	shipping_charges: Joi.number().min(0).default(0),

	// Contact Info
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.allow(null, ''),
	email: Joi.string().email().allow(null, ''),

	// Address Info
	address_line1: Joi.string().allow(null, ''),
	address_line2: Joi.string().allow(null, ''),
	city: Joi.string().allow(null, ''),
	state: Joi.string().allow(null, ''),
	postal_code: Joi.string().allow(null, ''),
	country: Joi.string().allow(null, ''),
	/*
	// Flexible Configurations
	appearance: Joi.object().allow(null),
	notifications: Joi.object().allow(null),
  */
});

// Update Store Schema
exports.updateStoreSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),

	// General Info
	name: Joi.string().optional(),
	description: Joi.string().allow(null, '').optional(),
	min_order_value: Joi.number().min(0).optional(),
	online_orders_enabled: Joi.boolean().optional(),
	store_logo: Joi.string().allow(null, '').optional(),

	// Lifecycle
	status: Joi.string().valid('active', 'inactive', 'deleted'),

	// Feature Scalable Fields
	courier_charges: Joi.number().min(0),
	shipping_charges: Joi.number().min(0),

	// Contact Info
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.allow(null, ''),
	email: Joi.string().email().allow(null, ''),

	// Address Info
	address_line1: Joi.string().allow(null, ''),
	address_line2: Joi.string().allow(null, ''),
	city: Joi.string().allow(null, ''),
	state: Joi.string().allow(null, ''),
	postal_code: Joi.string().allow(null, ''),
	country: Joi.string().allow(null, ''),
	/*
	// Flexible Configurations
	appearance: Joi.object(),
	notifications: Joi.object(),
  */
}).min(1);
