exports.StockTransactionDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		product_id: req.body?.productId || null,
		transaction_type: req.body?.transactionType || null, // 'in' or 'out'
		quantity: parseInt(req.body?.quantity) || 0,
		reason: req.body?.reason?.trim() || '',
	};
};
