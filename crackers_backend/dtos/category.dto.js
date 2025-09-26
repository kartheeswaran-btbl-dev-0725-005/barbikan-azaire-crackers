exports.CategoryDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		name: req.body?.name || '',
		description: req.body?.description?.trim() || '',
		status: req.body?.status || 'active', // default if not given
		group_by: req.body?.groupBy || null,
	};
};
