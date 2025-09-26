const Joi = require('joi');

// Create Payment Schema
const createPaymentSchema = Joi.object({
	tenant_id: Joi.string().optional(), // injected from params
	organization_id: Joi.string().optional(),
	type: Joi.string().valid('bank_transfer', 'upi').required(),
	account_owner: Joi.string().min(3).max(100).required(),
	phone_number: Joi.string().allow(null, '').optional(),

	// Bank Transfer fields
	bank_name: Joi.string()
		.min(2)
		.max(100)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	account_number: Joi.string()
		.min(6)
		.max(20)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	ifsc_code: Joi.string()
		.min(6)
		.max(11)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),

	// UPI fields
	upi_id: Joi.string()
		.min(3)
		.max(100)
		.when('type', {
			is: 'upi',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	qr_code: Joi.string().allow(null, '').optional(),

	// Common
	status: Joi.string().valid('active', 'inactive', 'deleted').optional(),
});

// Update Payment Schema
const updatePaymentSchema = Joi.object({
	tenant_id: Joi.string().optional(),
	organization_id: Joi.string().optional(),
	type: Joi.string().valid('bank_transfer', 'upi').required(),
	account_owner: Joi.string().min(3).max(100).optional(),
	phone_number: Joi.string().allow(null, '').optional(),

	// Bank Transfer fields
	bank_name: Joi.string()
		.min(2)
		.max(100)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	account_number: Joi.string()
		.min(6)
		.max(20)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	ifsc_code: Joi.string()
		.min(6)
		.max(11)
		.when('type', {
			is: 'bank_transfer',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),

	// UPI fields
	upi_id: Joi.string()
		.min(3)
		.max(100)
		.when('type', {
			is: 'upi',
			then: Joi.required(),
			otherwise: Joi.allow(null, ''),
		}),
	qr_code: Joi.string().allow(null, '').optional(),

	// Common
	status: Joi.string().valid('active', 'inactive', 'deleted').optional(),
});

module.exports = {
	createPaymentSchema,
	updatePaymentSchema,
};
