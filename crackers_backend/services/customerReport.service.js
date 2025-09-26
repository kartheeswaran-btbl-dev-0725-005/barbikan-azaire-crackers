const { Op } = require('sequelize');
const { Customer } = require('../models');
const { checkPermission } = require('../utils/permission.util');

const calculateMetrics = (customers) => {
	const total_customers = customers.length;
	const total_revenue = customers.reduce(
		(acc, c) => acc + parseFloat(c.total_spent || 0),
		0
	);
	const total_orders = customers.reduce(
		(acc, c) => acc + (c.total_orders || 0),
		0
	);
	const avg_order_value = total_orders > 0 ? total_revenue / total_orders : 0;

	const retained_customers = customers.filter((c) => c.total_orders > 1).length;
	const retention_rate = total_customers
		? (retained_customers / total_customers) * 100
		: 0;

	const top_customers = customers
		.sort((a, b) => b.total_spent - a.total_spent)
		.slice(0, 3)
		.map((c, idx) => ({
			rank: idx + 1,
			name: c.name,
			orders: parseInt(c.orders || 0), // added order count
			total_spent: parseFloat(c.total_spent || 0),
		}));

	const active_customers = total_customers;
	const high_value_customers = customers.filter(
		(c) => c.total_spent >= 50000
	).length;
	const regular_customers = customers.filter((c) => c.total_orders >= 10).length;

	return {
		stats: {
			total_customers,
			total_revenue,
			avg_order_value,
			retention_rate: retention_rate.toFixed(2) + '%',
		},
		top_customers,
		detailed_analysis: {
			active_customers: `${active_customers}/${total_customers}`,
			high_value_customers: `${high_value_customers}/${active_customers}`,
			regular_customers: `${regular_customers}/${active_customers}`,
		},
	};
};

exports.getCustomerReport = async (tenant_payload, from_date, to_date) => {
	const { tenant_id, organization_id } = tenant_payload;

	await checkPermission({ tenant_id, organization_id }, 'customer_report');
	const where = {
		tenant_id,
		organization_id,
		updatedAt: { [Op.between]: [new Date(from_date), new Date(to_date)] },
	};

	const customers = await Customer.findAll({ where, paranoid: true });

	const data = calculateMetrics(customers);

	return {
		success: true,
		message: 'Customer report fetched successfully',
		from_date,
		to_date,
		data,
	};
};
