exports.GroupByDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		group_by: req.body?.groupBy || '',
		status: req.body?.status || 'active',
	};
};
