const productService = require('../services/product.service');
const { ProductDTO } = require('../dtos/product.dto');

// Create Product
exports.create = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await productService.createProduct(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Product
exports.update = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { productId } = req.params;

		const result = await productService.updateProduct(
			productId,
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

// Soft Delete Product
exports.delete = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { productId } = req.params;

		const result = await productService.deleteProduct(productId, userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Product
exports.getById = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { productId } = req.params;

		const result = await productService.getProductById(userPayload, productId);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Products
exports.getAll = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const tenantPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		// Pagination query params
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await productService.getAllProducts(
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

// Get All Products with groupby
exports.getAllGroupBy = async (req, res) => {
	try {
		const dto = ProductDTO(req);
		const tenantPayload = {
			organization_id: dto.organization_id,
		};

		// ✅ Get groupBy from query
		const { groupBy } = req.query;

		const result = await productService.getAllProductsGroupby(
			tenantPayload,
			groupBy
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
