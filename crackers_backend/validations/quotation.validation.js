const Joi = require('joi');

// Create Quotation Validation
const createQuotationSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	quotation_id: Joi.string().required(),
	customer_name: Joi.string().min(3).max(100).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be a valid 10-digit number',
		}),
	address: Joi.string().allow('', null),
	date: Joi.date().required(),
	valid_until: Joi.date().optional(),
	notes: Joi.string().allow('', null),
	total_amount: Joi.number().positive().required(),

	// Items - no item_id here, we generate it in service
	items: Joi.array()
		.items(
			Joi.object({
				product_id: Joi.string().required(),
				product_name: Joi.string().required(),
				price: Joi.number().positive().required(),
				quantity: Joi.number().integer().positive().required(),
				total: Joi.number().positive().required(),
			})
		)
		.min(1)
		.required(),
});

// Update Quotation Validation
const updateQuotationSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	quotation_id: Joi.alternatives()
		.try(Joi.string(), Joi.allow(null))
		.optional()
		.strip(),
	customer_name: Joi.string().min(3).max(100).required(),
	phone: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.required()
		.messages({
			'string.pattern.base': 'Phone number must be a valid 10-digit number',
		}),
	address: Joi.string().allow('', null),
	date: Joi.date().required(),
	valid_until: Joi.date().optional(),
	notes: Joi.string().allow('', null),
	total_amount: Joi.number().positive().required(),

	items: Joi.array()
		.items(
			Joi.object({
				product_id: Joi.string().required(),
				product_name: Joi.string().required(),
				price: Joi.number().positive().required(),
				quantity: Joi.number().integer().positive().required(),
				total: Joi.number().positive().required(),
			})
		)
		.min(1)
		.required(),
});

module.exports = {
	createQuotationSchema,
	updateQuotationSchema,
};
