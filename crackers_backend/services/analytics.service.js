const { Op, fn, col, literal } = require('sequelize');
const { Customer, Estimate, StockLog, Product } = require('../models');
const { checkPermission } = require('../utils/permission.util');

// helper for percentage change
const percentageChange = (current, previous) => {
	if (previous === 0) return null;
	const change = ((current - previous) / previous) * 100;
	return Number(change.toFixed(1)); // 👈 ensure 1 decimal digit
};

// helper for "time ago"
const timeAgo = (date) => {
	const now = new Date();
	const diffMs = now - new Date(date);
	const diffSec = Math.floor(diffMs / 1000);
	if (diffSec < 60) return `${diffSec} sec ago`;
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin} min ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr} hours ago`;
	const diffDays = Math.floor(diffHr / 24);
	if (diffDays < 30) return `${diffDays} days ago`;
	const diffMonths = Math.floor(diffDays / 30);
	if (diffMonths < 12) return `${diffMonths} months ago`;
	return `${Math.floor(diffMonths / 12)} years ago`;
};

exports.getSummary = async (tenantPayload, fromDate, toDate) => {
	const { tenant_id, organization_id } = tenantPayload;
	await checkPermission({ tenant_id, organization_id }, 'analytics');

	const from = new Date(fromDate);
	const to = new Date(toDate);
	const diffMs = to.getTime() - from.getTime();
	const prevFrom = new Date(from.getTime() - diffMs - 1);
	const prevTo = new Date(from.getTime() - 1);

	// ===== KPIs =====
	const totalOrdersCurrent = await Customer.sum('orders', {
		where: { organization_id, createdAt: { [Op.between]: [from, to] } },
	});
	const onlineEnquiriesCurrent = await Estimate.count({
		where: {
			organization_id,
			createdAt: { [Op.between]: [from, to] },
			deletedAt: null,
		},
	});
	const totalSalesCurrent = await Estimate.sum('total_amount', {
		where: {
			organization_id,
			status: 'paid',
			createdAt: { [Op.between]: [from, to] },
			deletedAt: null,
		},
	});
	const totalOrdersPrev = await Customer.sum('orders', {
		where: { organization_id, createdAt: { [Op.between]: [prevFrom, prevTo] } },
	});
	const onlineEnquiriesPrev = await Estimate.count({
		where: {
			organization_id,
			createdAt: { [Op.between]: [prevFrom, prevTo] },
			deletedAt: null,
		},
	});
	const totalSalesPrev = await Estimate.sum('total_amount', {
		where: {
			organization_id,
			status: 'paid',
			createdAt: { [Op.between]: [prevFrom, prevTo] },
			deletedAt: null,
		},
	});

	// ===== Recent Orders (latest 5 in range) =====
	const recentOrders = await Estimate.findAll({
		where: {
			organization_id,
			deletedAt: null,
			createdAt: { [Op.between]: [from, to] },
		},
		attributes: [
			'estimate_id',
			'estimate_code',
			'customer_name',
			'total_amount',
			'status',
			'createdAt',
		],
		order: [['createdAt', 'DESC']],
		limit: 5,
	});
	const recentOrdersFormatted = recentOrders.map((o) => ({
		estimate_id: o.estimate_id,
		estimate_code: o.estimate_code,
		customer_name: o.customer_name || 'Unknown',
		amount: o.total_amount || 0,
		status: o.status,
		created_at: timeAgo(o.createdAt),
	}));

	// ===== Low Stock Alert =====
	// 1. Get all products
	const products = await Product.findAll({
		where: { tenant_id, organization_id },
		attributes: ['product_id', 'name', 'minimum_stock'],
	});

	// 2. Calculate current stock from StockLog
	const stockData = await StockLog.findAll({
		where: { organization_id, deletedAt: null },
		attributes: [
			'product_id',
			[
				fn(
					'SUM',
					literal(`CASE 
				WHEN transaction_type IN ('purchase_in','sales_return_in','transfer_in','adjustment_in') THEN quantity
				WHEN transaction_type IN ('sale_out','purchase_return_out','damage_out','loss_out','transfer_out','adjustment_out') THEN -quantity
				ELSE 0 END`)
				),
				'current_stock',
			],
		],
		group: ['product_id'],
	});

	// Map stockData by product_id
	const stockMap = {};
	stockData.forEach((s) => {
		stockMap[s.product_id] = parseInt(s.get('current_stock')) || 0;
	});

	// Filter products where Current < Minimum Stock
	const lowStockProducts = products
		.filter((p) => (stockMap[p.product_id] || 0) < p.minimum_stock) // use minimum_stock
		.map((p) => ({
			product_name: p.name, // use correct column
			current: stockMap[p.product_id] || 0,
			min: p.minimum_stock,
			status: 'Low Stock',
		}));

	return {
		success: true,
		message: 'Analytics summary fetched successfully',
		data: {
			total_orders: totalOrdersCurrent || 0,
			total_orders_percentage: percentageChange(
				totalOrdersCurrent || 0,
				totalOrdersPrev || 0
			),
			online_enquiries: onlineEnquiriesCurrent || 0,
			online_enquiries_percentage: percentageChange(
				onlineEnquiriesCurrent || 0,
				onlineEnquiriesPrev || 0
			),
			total_sales: totalSalesCurrent || 0,
			total_sales_percentage: percentageChange(
				totalSalesCurrent || 0,
				totalSalesPrev || 0
			),
			recent_orders: recentOrdersFormatted,
			low_stock_alert: lowStockProducts,
			from_date: fromDate,
			to_date: toDate,
		},
	};
};
