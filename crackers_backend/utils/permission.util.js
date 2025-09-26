const { TenantUser } = require('../models');
const createError = require('./error.util');

exports.checkPermission = async (tenantUserPayload, requiredModule) => {
	if (!tenantUserPayload?.tenant_id || !tenantUserPayload?.organization_id) {
		throw createError('TenantId, and OrganizationId are required', 400);
	}

	const tenantUser = await TenantUser.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});

	// If no tenant/org found
	if (!tenantUser) {
		throw createError("Tenant doesn't have any organization", 404);
	}

	// If no permission for required module
	if (
		!(
			tenantUser.permissions.includes(requiredModule) ||
			tenantUser.permissions.includes('*')
		)
	) {
		throw createError(`Permission denied`, 403);
	}

	return tenantUser;
};
