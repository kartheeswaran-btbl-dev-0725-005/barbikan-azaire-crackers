const Joi = require('joi');

exports.createStockSchema = Joi.object({
	tenant_id: Joi.string().required(),
	organization_id: Joi.string().required(),
	product_id: Joi.string().required(),
	transaction_type: Joi.string()
		.valid(
			'purchase_in', // stock coming in from supplier
			'sale_out', // stock going out to customer
			'sales_return_in', // customer returned item
			'purchase_return_out', // returned to supplier
			'damage_out', // damaged item removed
			'loss_out', // theft/loss/shortage
			'transfer_in', // incoming stock from branch
			'transfer_out', // outgoing stock to branch
			'adjustment_in', // manual correction increase
			'adjustment_out' // manual correction decrease
		)
		.required(),
	quantity: Joi.number().integer().positive().required(),
	reason: Joi.string().allow(null, '').optional(),
});
