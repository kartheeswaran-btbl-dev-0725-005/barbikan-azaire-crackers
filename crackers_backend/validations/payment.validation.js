const Joi = require('joi'); // Common base fields
const baseSchema = {
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	account_owner: Joi.string().min(3).max(100).required(),
	phone_number: Joi.string().allow(null, '').optional(),
	bank_name: Joi.string().min(2).max(100).required(), // 👈 required for both
};
// Bank Transfer schema
const createBankTransferSchema = Joi.object({
	...baseSchema,
	type: Joi.string().valid('bank_transfer').required(), // Allowed only for bank transfer
	account_number: Joi.string().min(6).max(20).required(),
	ifsc_code: Joi.string().min(6).max(11).required(),

	upi_id: Joi.string().allow(null, '').optional(),
	qr_code: Joi.string().allow(null, '').optional(),
});

// UPI schema
const createUPIPaymentSchema = Joi.object({
	...baseSchema,
	type: Joi.string().valid('upi').required(), // Allowed only for UPI
	upi_id: Joi.string().min(3).max(100).required(),
	qr_code: Joi.string().required(),

	account_number: Joi.string().allow(null, '').optional(),
	ifsc_code: Joi.string().allow(null, '').optional(),
});
module.exports = { createBankTransferSchema, createUPIPaymentSchema };
