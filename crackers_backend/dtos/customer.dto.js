exports.CustomerDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		name: req.body?.name || '',
		phone: req.body?.phone || '',
		email: req.body?.email || '',
		address: req.body?.address || '',
		status: req.body?.status || 'offline', // default status if not provided
		orders: req.body?.orders || 0,
		total_spent: req.body?.totalSpent || 0.0,
		last_order: req.body?.lastOrder || null,
	};
};
