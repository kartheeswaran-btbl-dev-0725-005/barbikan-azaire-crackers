exports.ProductDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		category_id: req.body?.categoryId || null,
		name: req.body?.name?.trim() || '',
		price: req.body?.price || 0,
		discount: req.body?.discount,
		pack_content: req.body?.packContent,
		stock_quantity: req.body?.stockQuantity || 0,
		unit_type: req.body?.unitType || null,
		minimum_stock: req.body?.minimumStock || 0,
		maximum_stock: req.body?.maximumStock || 0,
		description: req.body?.description?.trim() || '',
		status: req.body?.status || 'active', // default
		images:
			req.files && req.files.length > 0 ? req.files.map((f) => f.filename) : [],
	};
};
