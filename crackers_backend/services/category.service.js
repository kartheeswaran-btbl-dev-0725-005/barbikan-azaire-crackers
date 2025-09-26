const { Category } = require('../models');
const {
	createCategorySchema,
	updateCategorySchema,
} = require('../validations/category.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generateCategoryId } = require('../utils/idGenerator.util');

// Create Category Service
exports.createCategory = async (tenantUserPayload, payload) => {
	// Permission check
	await checkPermission(tenantUserPayload, 'product');

	const { error } = createCategorySchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Generate category_id
	const categoryId = await generateCategoryId(tenantUserPayload.tenant_id);

	// Insert record
	const category = await Category.create({
		category_id: categoryId,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
		name: payload.name,
		description: payload.description || null,
		group_by: payload.group_by,
		status: payload.status,
	});

	// 7. Response
	return {
		success: true,
		message: 'Category created successfully',
		data: {
			category_id: category.category_id,
			category_name: category.name,
			description: category.description || null,
			group_by: category.group_by,
			status: category.status,
		},
	};
};

// Update Category
exports.updateCategory = async (categoryId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'product');

	// Validate payload (optional but safer)
	const { error } = updateCategorySchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	const category = await Category.findOne({
		where: { category_id: categoryId },
	});
	if (!category) throw createError('Category not found', 404);

	await category.update(payload);

	return {
		success: true,
		message: 'Category updated successfully',
		data: formatDatesTime(category),
	};
};

// Soft Delete Category
exports.deleteCategory = async (categoryId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'product');

	const category = await Category.findOne({
		where: { category_id: categoryId },
	});
	if (!category) throw createError('Category not found', 404);

	await category.update({ status: 'deleted' }); // mark deleted
	await category.destroy(); // soft delete (paranoid: true)

	return {
		success: true,
		message: 'Category deleted successfully',
	};
};

// Get One Category
exports.getCategoryById = async (tenantUserPayload, categoryId) => {
	await checkPermission(tenantUserPayload, 'product');

	const category = await Category.findOne({
		where: { category_id: categoryId },
	});

	if (!category) throw createError('Category not found', 404);

	return {
		success: true,
		message: 'Category fetched successfully',
		data: formatDatesTime(category, { includeDeletedAt: true }),
	};
};

// Get All Categories
exports.getAllCategories = async (tenantPayload, page = 1, limit = 10) => {
	const { tenant_id, organization_id } = tenantPayload;

	// 1. Permission check
	await checkPermission({ tenant_id, organization_id }, 'category');

	// 2. Pagination setup
	const offset = (page - 1) * limit;

	// 3. Query paginated categories
	const { count, rows } = await Category.findAndCountAll({
		where: { tenant_id, organization_id },
		order: [['createdAt', 'ASC']],
		limit,
		offset,
		paranoid: true,
	});

	// 4. Return paginated data + total count
	return {
		success: true,
		message: 'Categories fetched successfully',
		total_categories: count,
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(rows),
	};
};

// Public service
// Get All Categories with description
exports.getAllGroupby = async (tenantPayload) => {
	const { organization_id } = tenantPayload;

	const categories = await Category.findAll({
		where: {
			organization_id,
			status: 'active',
			deletedAt: null,
		},
		attributes: ['group_by', 'description'],
		order: [['createdAt', 'ASC']],
	});

	// Extract unique group_by with description
	const groupMap = new Map();
	categories.forEach((cat) => {
		if (!groupMap.has(cat.group_by)) {
			groupMap.set(cat.group_by, {
				group_by: cat.group_by,
				description: cat.description || null,
			});
		}
	});

	const uniqueGroups = Array.from(groupMap.values());

	return {
		success: true,
		message: 'Group by fetched successfully',
		data: uniqueGroups,
	};
};
