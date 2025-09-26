const Joi = require('joi');

exports.updateTenantUserSchema = Joi.object({
	tenant_id: Joi.string().required().messages({
		'any.required': 'Tenant ID is required',
		'string.base': 'Tenant ID must be a string',
	}),
	organization_id: Joi.string().required().messages({
		'any.required': 'Organization ID is required',
		'string.base': 'Organization ID must be a string',
	}),
	user_id: Joi.string().required().messages({
		'any.required': 'User ID is required',
		'string.base': 'User ID must be a string',
	}),
	role: Joi.string()
		.valid('admin', 'manager', 'staff', 'viewer')
		.optional()
		.messages({
			'any.only': 'Invalid role',
			'string.base': 'Invalid role',
		}),
	permissions: Joi.array().items(Joi.string()).optional().messages({
		'array.base': 'Permissions must be an array of strings',
		'string.base': 'Each permission must be a string',
	}),
})
	.or('role', 'permissions')
	.messages({
		'object.missing': 'Either role or permissions must be provided',
	});
