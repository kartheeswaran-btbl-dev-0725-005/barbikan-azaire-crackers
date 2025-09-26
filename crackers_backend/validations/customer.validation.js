const Joi = require('joi');

// Create Customer Validation
const createCustomerSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	name: Joi.string().min(3).max(100).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required(),
	email: Joi.string().email().required(),
	address: Joi.string().allow(null, '').optional(),
	status: Joi.string()
		.valid('offline', 'online', 'deleted', 'active', 'inactive')
		.default('offline'),
	orders: Joi.number().integer().min(0).default(0),
	total_spent: Joi.number().precision(2).min(0).default(0),
	last_order: Joi.date().optional().allow(null),
});

// Update Customer Validation
const updateCustomerSchema = Joi.object({
	name: Joi.string().min(3).max(100).optional(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.optional(),
	email: Joi.string().email().optional(),
	address: Joi.string().allow(null, '').optional(),
	status: Joi.string()
		.valid('offline', 'online', 'deleted', 'active', 'inactive')
		.default('offline')
		.optional(),
	orders: Joi.number().integer().min(0).optional(),
	total_spent: Joi.number().precision(2).min(0).optional(),
	last_order: Joi.date().optional().allow(null),
});

module.exports = {
	createCustomerSchema,
	updateCustomerSchema,
};
