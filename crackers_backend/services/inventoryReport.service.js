// inventoryReport.service.js

const { Op } = require('sequelize');
const { StockLog, Product, Category } = require('../models');
const { checkPermission } = require('../utils/permission.util');

/**
 * Calculate inventory metrics
 */
const calculateMetrics = async (
	tenant_id,
	organization_id,
	from_date,
	to_date
) => {
	// 🔹 Convert to proper Date objects with start/end of day
	const fromDateTime = new Date(from_date);
	fromDateTime.setHours(0, 0, 0, 0);

	const toDateTime = new Date(to_date);
	toDateTime.setHours(23, 59, 59, 999);

	// 1️⃣ Get all stock logs in date range
	const stockLogs = await StockLog.findAll({
		where: {
			tenant_id,
			organization_id,
			createdAt: { [Op.between]: [fromDateTime, toDateTime] },
		},
		attributes: ['product_id', 'transaction_type', 'quantity'],
		raw: true,
	});

	// 2️⃣ Map stock in/out by product
	const stockMap = {};
	stockLogs.forEach((log) => {
		const { product_id, transaction_type, quantity } = log;

		if (!stockMap[product_id]) {
			stockMap[product_id] = { in: 0, out: 0 };
		}

		// Inward transactions
		if (
			['purchase_in', 'sales_return_in', 'transfer_in', 'adjustment_in'].includes(
				transaction_type
			)
		) {
			stockMap[product_id].in += quantity;
		}

		// Outward transactions
		if (
			[
				'sale_out',
				'purchase_return_out',
				'damage_out',
				'loss_out',
				'transfer_out',
				'adjustment_out',
			].includes(transaction_type)
		) {
			stockMap[product_id].out += quantity;
		}
	});

	// 3️⃣ Fetch products with categories
	const products = await Product.findAll({
		where: { tenant_id, organization_id },
		attributes: ['product_id', 'name', 'price', 'minimum_stock', 'category_id'],
		include: [
			{
				model: Category,
				as: 'category',
				attributes: ['name'],
			},
		],
		raw: true,
	});

	// Totals
	let total_stock_value = 0;
	let total_units = 0;
	let reorder_alerts = 0;

	// Category stock distribution
	const categoryMap = {};

	products.forEach((p) => {
		const stockData = stockMap[p.product_id] || { in: 0, out: 0 };
		const current_stock = stockData.in - stockData.out;

		total_units += current_stock;
		total_stock_value += current_stock * parseFloat(p.price || 0);

		if (current_stock < p.minimum_stock) {
			reorder_alerts++;
		}

		const categoryName = p['category.name'] || 'Uncategorized';
		if (!categoryMap[categoryName]) {
			categoryMap[categoryName] = 0;
		}
		categoryMap[categoryName] += current_stock;
	});

	// Stock by category with %
	const stock_by_category = Object.entries(categoryMap).map(([cat, units]) => {
		const percentage =
			total_units > 0 ? ((units / total_units) * 100).toFixed(1) : 0;
		return {
			category: cat,
			units,
			percentage: percentage + '%',
		};
	});

	// Inventory Performance Metrics (demo formulas – adjust as needed)
	const stock_coverage =
		total_units > 0
			? ((total_units / (total_units + reorder_alerts)) * 100).toFixed(1)
			: 0;
	const inventory_accuracy = 92.1; // demo value
	const order_fulfillment_rate = 89.6; // demo value
	const dead_stock_percentage = 3.2; // demo value

	return {
		stats: {
			total_stock_value,
			total_units,
			reorder_alerts,
			stock_turnover:
				(
					Object.values(stockMap).reduce((acc, s) => acc + s.out, 0) /
					(total_units > 0 ? total_units : 1)
				).toFixed(2) + 'x',
		},
		stock_by_category,
		inventory_performance: {
			stock_coverage: stock_coverage + '%',
			inventory_accuracy: inventory_accuracy + '%',
			order_fulfillment_rate: order_fulfillment_rate + '%',
			dead_stock_percentage: dead_stock_percentage + '%',
		},
	};
};

/**
 * Main service to get inventory report
 */
exports.getInventoryReport = async (tenant_payload, from_date, to_date) => {
	const { tenant_id, organization_id } = tenant_payload;

	await checkPermission({ tenant_id, organization_id }, 'inventory_report');

	const data = await calculateMetrics(
		tenant_id,
		organization_id,
		from_date,
		to_date
	);

	return {
		success: true,
		message: 'Inventory report fetched successfully',
		from_date,
		to_date,
		data,
	};
};
