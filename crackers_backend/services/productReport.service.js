const { Op } = require('sequelize');
const { Product, Category } = require('../models');
const { checkPermission } = require('../utils/permission.util');

const calculateMetrics = async (
	tenant_id,
	organization_id,
	from_date,
	to_date
) => {
	// Prepare date filter
	let dateFilter;
	if (from_date && to_date) {
		const startDate = new Date(from_date);
		const endDate = new Date(to_date);
		endDate.setHours(23, 59, 59, 999); // include full day
		dateFilter = { [Op.between]: [startDate, endDate] };
	}

	// 1. Total Products + Category Count
	const total_products = await Product.count({
		where: {
			tenant_id,
			organization_id,
			...(dateFilter && { createdAt: dateFilter }),
		},
	});

	const category_count = await Category.count({
		where: {
			tenant_id,
			organization_id,
			...(dateFilter && { createdAt: dateFilter }),
		},
	});

	// 2. Fetch products with category (raw: false to keep associations)
	const products = await Product.findAll({
		where: {
			tenant_id,
			organization_id,
			...(dateFilter && { createdAt: dateFilter }),
		},
		attributes: [
			'product_id',
			'name',
			'price',
			'stock_quantity',
			'minimum_stock',
			'category_id',
		],
		include: [
			{
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		],
	});

	// 3. Inventory Value
	const inventory_value = products.reduce(
		(acc, p) => acc + p.stock_quantity * parseFloat(p.price || 0),
		0
	);

	// 4. Low Stock Count
	const low_stock_count = products.filter(
		(p) => p.stock_quantity < p.minimum_stock
	).length;

	// 5. Out of Stock Count
	const out_of_stock_count = products.filter(
		(p) => p.stock_quantity <= 0
	).length;

	// 6. Top 5 Products by Value
	const top_products_by_value = products
		.map((p) => ({
			name: p.name,
			category: p.category?.name || null,
			total_value: p.stock_quantity * parseFloat(p.price || 0),
			stock_quantity: p.stock_quantity,
		}))
		.sort((a, b) => b.total_value - a.total_value)
		.slice(0, 5);

	return {
		stats: {
			total_products,
			category_count,
			inventory_value,
			low_stock_count,
			out_of_stock_count,
		},
		top_products_by_value,
	};
};

exports.getProductReport = async (tenant_payload, from_date, to_date) => {
	const { tenant_id, organization_id } = tenant_payload;

	// Check permission
	await checkPermission({ tenant_id, organization_id }, 'product_report');

	// Calculate report metrics
	const data = await calculateMetrics(
		tenant_id,
		organization_id,
		from_date,
		to_date
	);

	return {
		success: true,
		message: 'Product report fetched successfully',
		from_date,
		to_date,
		data,
	};
};
