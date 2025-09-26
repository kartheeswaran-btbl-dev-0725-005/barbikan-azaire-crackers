const { TenantUser, Organization } = require('../models');
const {
	updateTenantUserSchema,
} = require('../validations/tenantUser.validation');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');

exports.updateTenantUser = async (dto) => {
	const { error, value } = updateTenantUserSchema.validate(dto);
	if (error) throw createError(error.details[0].message, 400);

	const tenant = await TenantUser.findOne({
		where: {
			tenant_id: value.tenant_id,
			organization_id: value.organization_id,
		},
	});
	if (!tenant) {
		throw createError('Tenant user not found in this organization', 404);
	}

	const updateTenantUser = await TenantUser.findOne({
		where: {
			user_id: value.user_id,
		},
	});
	if (!updateTenantUser) {
		throw createError('Target tenant user not found', 404);
	}
	if (tenant.role == 'staff' || tenant.role == 'viewer') {
		if (tenant.tenant_id === updateTenantUser.tenant_id) {
			throw createError(
				'Unauthorized: You cannot update your own role or permissions',
				404
			);
		}
		throw createError(
			'Unauthorized: Staff and Viewer cannot update roles or permissions',
			404
		);
	}

	if (tenant.role == 'admin' || tenant.role == 'manager') {
		//Can't Change self roles and permissions
		if (tenant.tenant_id === updateTenantUser.tenant_id) {
			throw createError('You cannot update your own role or permissions', 404);
		}
		//Can't Change Owner roles and permissions
		if (updateTenantUser.role == 'owner') {
			const orgCreater = await Organization.findOne({
				where: {
					tenant_id: updateTenantUser.tenant_id,
					organization_id: updateTenantUser.organization_id,
				},
			});
			if (orgCreater.tenant_id == updateTenantUser.tenant_id) {
				throw createError(
					'Unauthorized: Owner roles and permissions cannot be updated',
					404
				);
			}
		} else {
			if (value.role) updateTenantUser.role = value.role;
			if (value.permissions) updateTenantUser.permissions = value.permissions;
			updateTenantUser.updated_by = tenant.tenant_id;
			await updateTenantUser.save();
		}
	}
	if (tenant.role == 'owner') {
		if (tenant.tenant_id === updateTenantUser.tenant_id) {
			throw createError('You cannot update your own role or permissions', 404);
		}
	}
	if (value.role) updateTenantUser.role = value.role;
	if (value.permissions) updateTenantUser.permissions = value.permissions;
	updateTenantUser.updated_by = tenant.tenant_id;
	await updateTenantUser.save();
	// 6. Return success
	return {
		success: true,
		message: 'Tenant user updated successfully',
	};
};

exports.getAllTenantUsers = async ({
	tenant_id,
	organization_id,
	page = 1,
	limit = 10,
}) => {
	// 1. Permission check
	await checkPermission({ tenant_id, organization_id }, 'tenant_user');

	// 2. Pagination setup
	const offset = (page - 1) * limit;

	// 3. Total users (all, including soft-deleted)
	const totalUsers = await TenantUser.count({
		where: { tenant_id, organization_id },
		paranoid: true,
	});

	// 4. Active users (non-deleted)
	const activeUsers = await TenantUser.count({
		where: { tenant_id, organization_id },
		paranoid: true,
	});

	// 5. Owner count = non-deleted users with role 'owner'
	const ownerCount = await TenantUser.count({
		where: { tenant_id, organization_id, role: 'owner' },
		paranoid: true,
	});

	// 6. Paginated users (non-deleted)
	const { rows } = await TenantUser.findAndCountAll({
		where: { tenant_id, organization_id },
		paranoid: true,
		order: [['createdAt', 'ASC']],
		limit,
		offset,
	});

	return {
		success: true,
		message: 'Tenant users fetched successfully',
		total_users: totalUsers,
		active_users: activeUsers,
		owner_count: ownerCount, // ✅ extra property
		totalPages: Math.ceil(totalUsers / limit),
		data: rows.map((user) => ({
			user_id: user.user_id,
			name: user.name,
			email: user.email,
			role: user.role,
			permissions: user.permissions,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})),
	};
};
