exports.updateTenantUserDto = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,
		user_id: req.params?.userId || null,
		role: req.body?.role || null,
		permissions: req.body?.permissions || null,
	};
};
