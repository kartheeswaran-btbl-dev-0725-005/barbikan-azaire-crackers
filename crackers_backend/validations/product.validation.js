const Joi = require('joi');

// Create Product Validation
exports.createProductSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	category_id: Joi.string().required().messages({
		'string.empty': 'Category ID is required',
		'any.required': 'Category ID is required',
	}),
	name: Joi.string().min(3).max(100).required().messages({
		'string.empty': 'Product name is required',
		'string.min': 'Product name should be at least 3 characters',
	}),
	price: Joi.number().min(0).required().messages({
		'number.base': 'Price must be a number',
	}),
	stock_quantity: Joi.number().integer().min(0).default(0),
	discount: Joi.number().integer().min(0).default(0),
	pack_content: Joi.string().allow('', null).optional(),
	unit_type: Joi.string().allow('', null).optional(),
	minimum_stock: Joi.number().integer().min(0).default(0),
	maximum_stock: Joi.number().integer().min(0).default(0),
	description: Joi.string().allow('', null),
	status: Joi.string().valid('active', 'inactive').default('active'),
	// ✅ images optional, array of filenames
	images: Joi.array().items(Joi.string()).optional(),
});

// Update Product Validation
exports.updateProductSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	category_id: Joi.string().required(),
	name: Joi.string().min(2).max(100).optional(),
	price: Joi.number().precision(2).min(0).optional(),
	discount: Joi.number().integer().min(0).optional(),
	stock_quantity: Joi.number().integer().min(0).optional(),
	pack_content: Joi.string().allow('', null).optional(),
	unit_type: Joi.string().allow('', null).optional(),
	minimum_stock: Joi.number().integer().min(0).optional(),
	maximum_stock: Joi.number().integer().min(0).optional(),
	status: Joi.string().valid('active', 'inactive', 'deleted').optional(),
	description: Joi.string().optional().allow(null, ''),
	images: Joi.array().items(Joi.string()).optional(),
});
