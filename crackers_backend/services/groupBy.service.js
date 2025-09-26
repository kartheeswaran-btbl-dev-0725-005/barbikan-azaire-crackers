const { GroupBy, sequelize } = require('../models');
const {
	createGroupBySchema,
	updateGroupBySchema,
} = require('../validations/groupBy.validation');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Create
exports.createGroupBy = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'category');

	const { error } = createGroupBySchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	const groupBy = await sequelize.transaction(async (t) => {
		return await GroupBy.create(
			{
				tenant_id: tenantUserPayload.tenant_id,
				organization_id: tenantUserPayload.organization_id,
				group_by: payload.group_by,
				status: payload.status,
			},
			{ transaction: t }
		);
	});

	return {
		success: true,
		message: 'GroupBy created successfully',
		data: groupBy,
	};
};

// Update
exports.updateGroupBy = async (id, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'category');

	const { error } = updateGroupBySchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	const groupBy = await GroupBy.findOne({
		where: {
			id,
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});
	if (!groupBy) throw createError('GroupBy not found', 404);

	await groupBy.update(payload);

	return {
		success: true,
		message: 'GroupBy updated successfully',
		data: formatDatesTime(groupBy),
	};
};

// Delete (Soft)
exports.deleteGroupBy = async (id, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'category');

	const groupBy = await GroupBy.findOne({
		where: {
			id,
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});
	if (!groupBy) throw createError('GroupBy not found', 404);

	await groupBy.destroy();

	return {
		success: true,
		message: 'GroupBy deleted successfully',
	};
};

// Get One
exports.getGroupByById = async (tenantUserPayload, id) => {
	await checkPermission(tenantUserPayload, 'category');

	const groupBy = await GroupBy.findOne({
		where: {
			id,
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});

	if (!groupBy) throw createError('GroupBy not found', 404);

	return {
		success: true,
		message: 'GroupBy fetched successfully',
		data: formatDatesTime(groupBy, { includeDeletedAt: true }),
	};
};

// Get All
exports.getAllGroupBy = async (tenantPayload, page = 1, limit = 10) => {
	const { tenant_id, organization_id } = tenantPayload;

	await checkPermission({ tenant_id, organization_id }, 'category');

	const offset = (page - 1) * limit;

	const { count, rows } = await GroupBy.findAndCountAll({
		where: { tenant_id, organization_id },
		order: [['createdAt', 'ASC']],
		limit,
		offset,
		paranoid: true,
	});

	return {
		success: true,
		message: 'GroupBy list fetched successfully',
		total: count,
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(rows),
	};
};
