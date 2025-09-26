const { Customer } = require('../models');
const createError = require('../utils/error.util');
const {
	updateCustomerSchema,
	createCustomerSchema,
} = require('../validations/customer.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const { checkPermission } = require('../utils/permission.util');
const { generateCustomerId } = require('../utils/idGenerator.util');
const { Op } = require('sequelize');

// Create Customer
exports.createCustomer = async (customerPayload, tenantUserPayload) => {
	// 1. Check tenant_user + permission
	await checkPermission(
		{
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		'customer'
	);

	// 2. Validate request body
	const { error } = createCustomerSchema.validate(customerPayload);
	if (error) throw createError(error.details[0].message, 400);

	// 3. Generate new unique customer_id
	const customer_id = await generateCustomerId();

	// 4. Create customer record
	const customer = await Customer.create({
		...customerPayload,
		customer_id,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
	});

	// 5. Return response
	return {
		success: true,
		message: 'Customer created successfully',
		data: {
			customer_id: customer.customer_id,
			name: customer.name,
			phone: customer.phone,
			email: customer.email,
			address: customer.address,
			status: customer.status,
			orders: customer.orders,
			total_spent: customer.total_spent,
			last_order: customer.last_order,
		},
	};
};

// Update Customer
exports.updateCustomer = async (
	customerId,
	updatePayload,
	tenantUserPayload
) => {
	// 1. Check tenant_user + permission
	await checkPermission(
		{
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		'customer'
	);

	// 2. Remove fields that must not be updated
	delete updatePayload.tenant_id;
	delete updatePayload.organization_id;
	delete updatePayload.customer_id;

	// 3. Validate request body
	const { error } = updateCustomerSchema.validate(updatePayload);
	if (error) throw createError(error.details[0].message, 400);

	// 4. Find customer
	const customer = await Customer.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			customer_id: customerId,
		},
	});
	if (!customer) throw createError('Customer not found', 404);

	// 5. Update fields
	await customer.update(updatePayload);

	return {
		success: true,
		message: 'Customer updated successfully',
	};
};

// Soft Delete Customer
exports.deleteCustomer = async (customerId, tenantUserPayload) => {
	// 1. Check tenant_user + permission
	await checkPermission(
		{
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		'customer'
	);

	// 2. Find customer
	const customer = await Customer.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			customer_id: customerId,
		},
	});
	if (!customer) throw createError('Customer not found', 404);

	// 3. Update status first
	await customer.update({ status: 'deleted' });

	// 4. Then soft delete (this will set deletedAt if paranoid = true)
	await customer.destroy();

	return {
		success: true,
		message: 'Customer deleted successfully',
	};
};

// Get One Customer
exports.getCustomerById = async (customerId, tenantUserPayload) => {
	// 1. Check tenant_user + permission
	await checkPermission(
		{
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		'customer'
	);

	// 2. Find customer
	const customer = await Customer.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			customer_id: customerId,
		},
	});
	if (!customer) throw createError('Customer not found', 404);

	return {
		success: true,
		message: 'Customer fetched successfully',
		data: formatDatesTime(customer, { includeDeletedAt: true }),
	};
};

// Get All Customers (tenant/org scoped + filters + aggregation)
exports.getAllCustomers = async (
	tenantPayload,
	page = 1,
	limit = 10,
	search = null,
	status = null
) => {
	const { tenant_id, organization_id } = tenantPayload;

	await checkPermission({ tenant_id, organization_id }, 'customer');

	const offset = (page - 1) * limit;

	// 🔎 Build where clause
	const whereClause = { tenant_id, organization_id };

	if (status) {
		whereClause.status = status;
	}

	if (search) {
		whereClause[Op.or] = [
			{ name: { [Op.like]: `%${search}%` } },
			{ phone: { [Op.like]: `%${search}%` } },
			{ email: { [Op.like]: `%${search}%` } },
		];
	}

	// 📄 Fetch paginated rows
	const { count, rows } = await Customer.findAndCountAll({
		where: whereClause,
		order: [['createdAt', 'DESC']],
		limit,
		offset,
		paranoid: true,
	});

	// 📊 Aggregation counts (global org-wide, not filtered)
	const totalCustomers = await Customer.count({
		where: { tenant_id, organization_id },
		paranoid: false,
	});

	const onlineCount = await Customer.count({
		where: { tenant_id, organization_id, status: 'online' },
		paranoid: true,
	});

	const offlineCount = await Customer.count({
		where: { tenant_id, organization_id, status: 'offline' },
		paranoid: true,
	});

	const deletedCount = await Customer.count({
		where: { tenant_id, organization_id, status: 'deleted' },
		paranoid: false,
	});

	const activeCount = await Customer.count({
		where: { tenant_id, organization_id, status: 'active' },
		paranoid: true,
	});

	const inActiveCount = await Customer.count({
		where: { tenant_id, organization_id, status: 'inactive' },
		paranoid: true,
	});

	// 📆 New customers this month
	const today = new Date();
	const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	const allThisMonth = await Customer.findAll({
		where: { tenant_id, organization_id },
		paranoid: false,
	});
	const newThisMonth = allThisMonth.filter(
		(c) => c.createdAt >= startOfMonth
	).length;

	// 💰 Sum total_spent of active customers
	const activeCustomers = await Customer.findAll({
		where: { tenant_id, organization_id },
		paranoid: true,
	});

	const totalSpentSum = activeCustomers.reduce(
		(sum, customer) => sum + parseFloat(customer.total_spent || 0),
		0
	);

	return {
		success: true,
		message: 'Customers fetched successfully',
		total_customers: totalCustomers,
		online_count: onlineCount,
		offline_count: offlineCount,
		deleted_count: deletedCount,
		active_count: activeCount,
		inactive_count: inActiveCount,
		new_this_month: newThisMonth,
		total_spent: totalSpentSum.toFixed(2),
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(rows, { includeDeletedAt: true }),
	};
};
