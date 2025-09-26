const { Product, Category } = require('../models');
const {
	createProductSchema,
	updateProductSchema,
} = require('../validations/product.validation');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generateProductId } = require('../utils/idGenerator.util');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const { sequelize } = require('../models'); // make sure sequelize instance is imported
const fs = require('fs');
const path = require('path');

// Create Product Service
exports.createProduct = async (tenantUserPayload, payload) => {
	// Permission check
	await checkPermission(tenantUserPayload, 'product');

	// Validation
	const { error } = createProductSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Check category
	const isCategory = await Category.findOne({
		where: { category_id: payload.category_id },
		paranoid: true,
	});

	if (!isCategory) throw createError('Invalid category', 400);

	// Generate product_id
	const productId = await generateProductId();

	// Generate product_code for this organization using MAX
	const lastProduct = await Product.findOne({
		where: { organization_id: payload.organization_id },
		attributes: [
			[sequelize.literal('MAX(CAST(product_code AS UNSIGNED))'), 'max_code'],
		],
		raw: true,
	});

	let nextCode = '01'; // default if no product exists
	if (lastProduct && lastProduct.max_code) {
		nextCode = String(parseInt(lastProduct.max_code) + 1).padStart(2, '0');
	}

	// Create product with product_code
	const product = await Product.create({
		product_id: productId,
		product_code: nextCode,
		...payload,
	});

	return {
		success: true,
		message: 'Product created successfully',
	};
};

// Update Product
exports.updateProduct = async (productId, payload, tenantUserPayload) => {
	// Permission check
	await checkPermission(tenantUserPayload, 'product');

	// Validate payload
	const { error } = updateProductSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Find product
	const product = await Product.findOne({
		where: { product_id: productId },
	});
	if (!product) throw createError('Product not found', 404);

	// Check category existence
	if (payload.category_id) {
		const category = await Category.findOne({
			where: { category_id: payload.category_id },
		});
		if (!category) throw createError('Category not found', 404);
	}

	await product.update(payload);

	return {
		success: true,
		message: 'Product updated successfully',
		// data: formatDatesTime(product),
	};
};

// Soft Delete Product
exports.deleteProduct = async (productId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'product');

	const product = await Product.findOne({
		where: { product_id: productId },
	});
	if (!product) throw createError('Product not found', 404);

	// Mark status deleted
	await product.update({ status: 'deleted' });
	// Perform soft delete (because paranoid: true)
	await product.destroy();

	return {
		success: true,
		message: 'Product deleted successfully',
	};
};

// Get One Product
exports.getProductById = async (tenantUserPayload, productId) => {
	await checkPermission(tenantUserPayload, 'product');

	// Include deleted records
	const product = await Product.findOne({
		where: { product_id: productId },
		paranoid: false,
	});

	if (!product) throw createError('Product not found', 404);

	// Check if soft-deleted
	if (product.deletedAt) {
		return {
			success: true,
			message: 'Product is deleted',
			data: formatDatesTime(product, { includeDeletedAt: true }),
		};
	}

	// Normal case
	return {
		success: true,
		message: 'Product fetched successfully',
		data: formatDatesTime(product),
	};
};

// Get all products with full details + summary
exports.getAllProducts = async (tenantPayload, page = 1, limit = 10) => {
	const { tenant_id, organization_id } = tenantPayload;

	// 1. Permission check
	await checkPermission({ tenant_id, organization_id }, 'product');

	// 2. Pagination setup
	const offset = (page - 1) * limit;

	// 3. Fetch paginated products including category
	const { count, rows } = await Product.findAndCountAll({
		where: { tenant_id, organization_id },
		order: [['createdAt', 'ASC']],
		limit,
		offset,
		paranoid: true,
		include: [
			{
				model: Category,
				as: 'category',
				attributes: ['category_id', 'name', 'group_by'],
			},
		],
	});
	// 4. Compute summary metrics
	let lowStockCount = 0;
	let criticalStockCount = 0;
	let totalValue = 0;

	const formattedData = rows.map((product) => {
		// Determine stock status
		let productValue = 0;

		if (product.stock_quantity < product.minimum_stock / 2) {
			criticalStockCount++;
		} else if (product.stock_quantity < product.minimum_stock) {
			lowStockCount++;
		}

		// Total value
		if (product.price && product.stock_quantity) {
			productValue = parseFloat(product.price) * parseInt(product.stock_quantity);
			totalValue += productValue;
		}

		return {
			product_id: product.product_id,
			product_code: product.product_code,
			product_name: product.name,
			category_id: product.category?.category_id || null,
			category_name: product.category?.name || null,
			group_by: product.category?.group_by || null, // ✅ new field
			price: product.price,
			stock_quantity: product.stock_quantity,
			unit_type: product.unit_type,
			minimum_stock: product.minimum_stock,
			maximum_stock: product.maximum_stock,
			pack_content: product.pack_content,
			discount: product.discount,
			status: product.status,
			description: product.description,
			images: product.images,
			value: productValue.toLocaleString('en-IN'),
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
			deletedAt: product.deletedAt,
		};
	});

	return {
		success: true,
		message: 'Products fetched successfully',
		total_products: count,
		low_stock_count: lowStockCount,
		critical_stock_count: criticalStockCount, // ✅ added
		total_value: totalValue.toLocaleString('en-IN'),
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(formattedData),
	};
};

// Public service
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads'); // go one level up from services
// Get all products with filter groupby
exports.getAllProductsGroupby = async (tenantPayload, groupBy = null) => {
	const { organization_id } = tenantPayload;

	// Base condition → Only active products
	const whereCondition = {
		organization_id,
		status: 'active',
		deletedAt: null,
	};

	// Include with optional filter → Only active categories
	const includeCondition = [
		{
			model: Category,
			as: 'category',
			attributes: ['category_id', 'name', 'group_by', 'status'],
			where: {
				status: 'active',
				deletedAt: null,
				...(groupBy && { group_by: groupBy }),
			},
			required: true,
			paranoid: false,
		},
	];

	// Fetch paginated products
	const { count, rows } = await Product.findAndCountAll({
		where: whereCondition,
		order: [['createdAt', 'ASC']],
		paranoid: true,
		include: includeCondition,
	});

	// ✅ Group products by category
	const categoryMap = {};

	rows.forEach((product) => {
		const categoryId = product.category?.category_id || 'uncategorized';
		const categoryName = product.category?.name || 'Uncategorized';

		if (!categoryMap[categoryId]) {
			categoryMap[categoryId] = {
				category_id: categoryId,
				category_name: categoryName,
				products: [],
			};
		}

		// ✅ Check images exist
		let safeImages = [];
		if (product.images && Array.isArray(product.images)) {
			safeImages = product.images.filter((img) =>
				fs.existsSync(path.join(UPLOADS_DIR, img))
			);
		}

		categoryMap[categoryId].products.push({
			product_id: product.product_id,
			product_code: product.product_code,
			product_name: product.name,
			price: product.price,
			discount: product.discount || 0,
			pack_content: product.pack_content || null,
			stock_quantity: product.stock_quantity,
			unit_type: product.unit_type,
			minimum_stock: product.minimum_stock,
			maximum_stock: product.maximum_stock,
			status: product.status,
			description: product.description,
			images: safeImages, // ✅ only existing files
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		});
	});

	// Convert to array
	const groupedData = Object.values(categoryMap);

	return {
		success: true,
		message: 'Products fetched successfully',
		total_products: count,
		data: formatDatesTime(groupedData),
	};
};
