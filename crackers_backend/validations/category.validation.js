const Joi = require('joi');

// Joi schema
const createCategorySchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	name: Joi.string().min(3).max(100).required(),
	description: Joi.string().allow('').optional(),
	status: Joi.string().valid('active', 'inactive', 'deleted').default('active'),
	group_by: Joi.string()
		.valid('Retail', 'Combo Pack', 'Wholesale', 'Gift Box', 'Family Pack')
		.default('Retail'),
});

const updateCategorySchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	name: Joi.string().min(3).max(100).optional(),
	description: Joi.string().allow('').optional(),
	status: Joi.string()
		.valid('active', 'inactive', 'deleted')
		.default('active')
		.optional(),
	group_by: Joi.string()
		.valid('Retail', 'Combo Pack', 'Wholesale', 'Gift Box', 'Family Pack')
		.default('Retail'),
});

module.exports = {
	createCategorySchema,
	updateCategorySchema,
};
