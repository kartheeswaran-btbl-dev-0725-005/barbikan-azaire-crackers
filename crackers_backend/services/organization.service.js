const { Organization, TenantUser } = require('../models');
const createError = require('../utils/error.util');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const { generateUserId } = require('../utils/idGenerator.util');

// Create Organization + default admin tenant user
exports.createOrganization = async ({ tenantId, organizationId }) => {
	if (!tenantId || !organizationId) {
		throw createError(
			'tenantId, organizationId and tenantUserId are required',
			400
		);
	}

	// 1. Prevent duplicate org per (tenant, org)
	const existing = await Organization.findOne({
		where: { tenant_id: tenantId, organization_id: organizationId },
	});
	if (existing) throw createError('Organization already exists', 409);

	// 2. Create organization
	const organization = await Organization.create({
		tenant_id: tenantId,
		organization_id: organizationId,
	});

	// 3. Generate user_id for this tenant
	const tenantuserId = await generateUserId();

	// 4. Create default admin user
	const tenantUser = await TenantUser.create({
		user_id: tenantuserId,
		tenant_id: tenantId,
		organization_id: organizationId,
		role: 'owner',
		permissions: ['*'], // super admin for this org
	});

	return {
		success: true,
		message: 'Organization created successfully',
		data: {
			tenant_id: organization.tenant_id,
			organization_id: organization.organization_id,
			tenant_user_info: {
				user_id: tenantUser.user_id,
				role: tenantUser.role,
			},
		},
	};
};

// Get One Organization
exports.getOrganizationById = async (tenantId, organizationId) => {
	if (!tenantId || !organizationId) {
		throw createError('tenantId and organizationId are required', 400);
	}

	// 1. Find organization under this tenant
	const organization = await Organization.findOne({
		where: { tenant_id: tenantId, organization_id: organizationId },
	});

	if (!organization) throw createError('Organization not found', 404);

	// 2. Return response
	return {
		success: true,
		message: 'Organization fetched successfully',
		data: formatDatesTime(organization),
	};
};

// Get All Organizations
exports.getOrganizations = async (tenantId) => {
	// 1. Verify tenant has at least one organization
	const tenantOrg = await Organization.findOne({
		where: { tenant_id: tenantId },
	});
	if (!tenantOrg) throw createError("Tenant doesn't have any Organization", 404);

	// 2. Fetch all organizations under this tenant
	const organizations = await Organization.findAll({
		where: { tenant_id: tenantId },
		order: [['createdAt', 'DESC']],
	});
	if (!organizations || organizations.length === 0) {
		return {
			success: true,
			message: 'No organizations found for this tenant',
			data: [],
		};
	}

	// 3. Return response
	return {
		success: true,
		message: 'Organizations fetched successfully',
		organization_count: organizations.length,
		data: formatDatesTime(organizations),
	};
};
