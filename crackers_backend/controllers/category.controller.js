const categoryService = require('../services/category.service');
const { CategoryDTO } = require('../dtos/category.dto');

// Create Category
exports.create = async (req, res) => {
	try {
		const dto = CategoryDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await categoryService.createCategory(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Category
exports.update = async (req, res) => {
	try {
		const dto = CategoryDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { categoryId } = req.params;

		const result = await categoryService.updateCategory(
			categoryId,
			dto,
			userPayload
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Soft Delete Category
exports.delete = async (req, res) => {
	try {
		const dto = CategoryDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { categoryId } = req.params;
		const result = await categoryService.deleteCategory(categoryId, userPayload);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Category
exports.getById = async (req, res) => {
	try {
		const dto = CategoryDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { categoryId } = req.params;

		const result = await categoryService.getCategoryById(userPayload, categoryId);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Categories
exports.getAll = async (req, res) => {
	try {
		const dto = CategoryDTO(req);
		const tenantPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await categoryService.getAllCategories(
			tenantPayload,
			page,
			limit
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

//Public Api
// Get All Categories
exports.getAllGroupby = async (req, res) => {
	try {
		const dto = CategoryDTO(req); // extract organization_id etc.
		const tenantPayload = {
			organization_id: dto.organization_id,
		};

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await categoryService.getAllGroupby(
			tenantPayload,
			page,
			limit
		);

		return res.status(200).json(result);
	} catch (error) {
		console.error('Error in getAllCategories:', error);

		return res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
