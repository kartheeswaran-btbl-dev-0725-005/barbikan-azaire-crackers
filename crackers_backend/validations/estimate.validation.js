const Joi = require('joi');

// Create Estimate Validation
exports.createEstimateSchema = Joi.object({
	organization_id: Joi.string().max(20).required(),

	customer_name: Joi.string().max(100).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required(),
	email: Joi.string().email().optional().allow(null, ''),
	address: Joi.string().max(255).allow(null, ''),
	state: Joi.string().max(100).allow(null, ''),
	city: Joi.string().max(100).allow(null, ''),
	postal_code: Joi.string().max(20).allow(null, ''),

	message: Joi.string().max(500).allow(null, ''),

	priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
	status: Joi.string()
		.valid(
			'new',
			'contacted',
			'paid',
			'couriered',
			'delivered',
			'canceled',
			'refunded',
			'deleted'
		)
		.default('new'),

	notes: Joi.string().max(500).allow(null, '').optional(),
	total_price: Joi.number().precision(2).min(0).required(),
	discount: Joi.number().precision(2).min(0).default(0),
	total_amount: Joi.number().precision(2).min(0).required(),

	product_items: Joi.array()
		.items(
			Joi.object({
				product_id: Joi.string().required(),
				name: Joi.string().required(),
				quantity: Joi.number().integer().min(1).default(1),
				price: Joi.number().precision(2).min(0).default(0),
				subtotal: Joi.number().precision(2).min(0).optional(),
			})
		)
		.min(1)
		.required(),
});

// Update Estimate Validation
exports.updateEstimateSchema = Joi.object({
	tenant_id: Joi.string().max(20).required(),
	organization_id: Joi.string().max(20).required(),

	customer_name: Joi.string().max(100).allow(null, '').optional(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.allow(null, '')
		.optional(),
	email: Joi.string().email().optional().allow(null, ''),
	address: Joi.string().max(255).optional().allow(null, ''),
	state: Joi.string().max(100).optional().allow(null, ''),
	city: Joi.string().max(100).optional().allow(null, ''),
	postal_code: Joi.string().max(20).optional().allow(null, ''),
	message: Joi.string().max(500).optional().allow(null, ''),
	priority: Joi.string().valid('low', 'medium', 'high').optional(),
	status: Joi.string()
		.valid(
			'new',
			'contacted',
			'paid',
			'couriered',
			'delivered',
			'canceled',
			'refunded',
			'deleted'
		)
		.optional(),
	notes: Joi.string().max(500).optional().allow(null, ''),

	total_price: Joi.number().precision(2).min(0).optional(),
	discount: Joi.number().precision(2).min(0).optional(),
	total_amount: Joi.number().precision(2).min(0).optional(),

	product_items: Joi.array()
		.items(
			Joi.object({
				product_id: Joi.string().required(),
				name: Joi.string().required(),
				quantity: Joi.number().integer().min(1).default(1),
				price: Joi.number().precision(2).min(0).default(0),
				subtotal: Joi.number().precision(2).min(0).optional(),
			})
		)
		.optional(),
});
