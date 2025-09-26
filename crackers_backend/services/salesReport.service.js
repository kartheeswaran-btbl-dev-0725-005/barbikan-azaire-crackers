const { Op } = require('sequelize');
const { Estimate } = require('../models');
const { checkPermission } = require('../utils/permission.util');

// Calculate metrics for a set of estimates
const calculateMetrics = (estimates) => {
	let totalSales = 0;
	let totalOrders = 0;
	const totalEstimates = estimates.length;

	estimates.forEach((e) => {
		if (e.status === 'paid') {
			totalSales += parseFloat(e.total_amount || 0);
			totalOrders++;
		}
	});

	const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
	const conversionRate =
		totalEstimates > 0 ? (totalOrders / totalEstimates) * 100 : 0;

	return { totalSales, totalOrders, avgOrderValue, conversionRate };
};

// Calculate percentage change between current and previous period
const percentageChange = (current, previous) => {
	if (previous === 0) return null; // undefined if previous period = 0
	return ((current - previous) / previous) * 100;
};

exports.getAllReports = async (tenantPayload, fromDate, toDate) => {
	const { tenant_id, organization_id } = tenantPayload;

	await checkPermission({ tenant_id, organization_id }, 'report');

	// Current period
	const whereCurrent = {
		organization_id,
		createdAt: { [Op.between]: [new Date(fromDate), new Date(toDate)] },
	};

	// Previous period = same length immediately before fromDate
	const from = new Date(fromDate);
	const to = new Date(toDate);
	const diffMs = to.getTime() - from.getTime();
	const prevFrom = new Date(from.getTime() - diffMs - 1); // subtract 1ms to avoid overlap
	const prevTo = new Date(from.getTime() - 1);

	const wherePrevious = {
		organization_id,
		createdAt: { [Op.between]: [prevFrom, prevTo] },
	};

	// Fetch estimates
	const currentEstimates = await Estimate.findAll({
		where: whereCurrent,
		paranoid: true,
		attributes: ['total_amount', 'status'],
	});

	const previousEstimates = await Estimate.findAll({
		where: wherePrevious,
		paranoid: true,
		attributes: ['total_amount', 'status'],
	});

	// Calculate metrics
	const current = calculateMetrics(currentEstimates);
	const previous = calculateMetrics(previousEstimates);

	// Calculate percentage changes
	const totalSalesPercentage = percentageChange(
		current.totalSales,
		previous.totalSales
	);
	const totalOrdersPercentage = percentageChange(
		current.totalOrders,
		previous.totalOrders
	);
	const avgOrderPercentage = percentageChange(
		current.avgOrderValue,
		previous.avgOrderValue
	);
	const conversionRatePercentage = percentageChange(
		current.conversionRate,
		previous.conversionRate
	);

	return {
		success: true,
		message: 'Reports fetched successfully',
		data: {
			total_sales: current.totalSales,
			total_orders: current.totalOrders,
			avg_order_value: current.avgOrderValue,
			conversion_rate: current.conversionRate,
			total_sales_percentage:
				totalSalesPercentage !== null
					? parseFloat(totalSalesPercentage.toFixed(1))
					: null,
			total_orders_percentage:
				totalOrdersPercentage !== null
					? parseFloat(totalOrdersPercentage.toFixed(1))
					: null,
			avg_order_percentage:
				avgOrderPercentage !== null
					? parseFloat(avgOrderPercentage.toFixed(1))
					: null,
			conversion_rate_percentage:
				conversionRatePercentage !== null
					? parseFloat(conversionRatePercentage.toFixed(1))
					: null,
			from_date: fromDate,
			to_date: toDate,
		},
	};
};
