const {
	Estimate,
	EstimateItem,
	Product,
	Sales,
	Customer,
	sequelize,
} = require('../models');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const {
	generateEstimateId,
	generateItemId,
	// generateInvoiceId,
	generateCustomerId,
	generateEstimateIdPublic,
} = require('../utils/idGenerator.util');
const {
	createEstimateSchema,
	updateEstimateSchema,
} = require('../validations/estimate.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Create Estimate
exports.createEstimate = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'estimate');

	// Joi Validation
	const { error } = createEstimateSchema.validate({
		...payload,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
	});
	if (error) throw createError(error.details[0].message, 400);

	// 1️⃣ Auto-calculate priority based on total_amount
	let priority = 'low';
	if (payload.total_amount >= 20000) {
		priority = 'high';
	} else if (payload.total_amount >= 10000) {
		priority = 'medium';
	}

	// 2️⃣ Generate Estimate ID
	const estimateId = await generateEstimateId();

	// 3️⃣ Create Estimate (master record)
	const estimate = await Estimate.create({
		estimate_id: estimateId,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
		customer_name: payload.customer_name,
		phone: payload.phone,
		email: payload.email,
		address: payload.address,
		state: payload.state,
		city: payload.city,
		postal_code: payload.postal_code,
		message: payload.message,
		priority, // 👈 calculated automatically
		status: 'pending',
		notes: payload.notes,
		total_price: payload.total_price,
		discount: payload.discount,
		total_amount: payload.total_amount,
	});

	// 4️⃣ Create Estimate Items (details)
	for (const item of payload.product_items) {
		// Check if product exists
		const productExists = await Product.findOne({
			where: { product_id: item.product_id },
		});
		if (!productExists) {
			throw createError(`Product not found: ${item.product_id}`, 404);
		}

		// If product exists, proceed to create item
		const itemId = await generateItemId();
		await EstimateItem.create({
			item_id: itemId,
			estimate_id: estimateId,
			product_id: item.product_id,
			name: item.name,
			quantity: item.quantity,
			price: item.price,
			subtotal: (item.quantity || 1) * (item.price || 0), // auto calc
		});
	}

	// 5️⃣ Fetch created estimate with items
	const createdEstimate = await Estimate.findOne({
		where: { estimate_id: estimateId },
		include: [{ model: EstimateItem, as: 'items' }],
	});

	return {
		success: true,
		message: 'Online Estimate created successfully',
		data: formatDatesTime(createdEstimate),
	};
};

// Update Estimate
exports.updateEstimate = async (estimateId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'estimate');

	const estimate = await Estimate.findOne({
		where: { estimate_id: estimateId },
	});
	if (!estimate) throw createError('Estimate not found', 404);

	const oldStatus = estimate.status;

	// Joi validation
	const { error } = updateEstimateSchema.validate({
		...payload,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
	});
	if (error) throw createError(error.details[0].message, 400);

	delete payload.tenant_id;
	delete payload.organization_id;

	// Update Estimate base fields
	await estimate.update({
		customer_name: payload.customer_name,
		phone: payload.phone,
		email: payload.email,
		address: payload.address,
		state: payload.state,
		city: payload.city,
		postal_code: payload.postal_code,
		message: payload.message,
		priority: payload.priority,
		status: payload.status,
		notes: payload.notes,
		total_price: payload.total_price,
		discount: payload.discount,
		total_amount: payload.total_amount,
		product_items: payload.product_items,
	});

	const newStatus = estimate.status;

	// CUSTOMER SYNC
	let customer = await Customer.findOne({
		where: {
			phone: estimate.phone,
			tenant_id: tenantUserPayload.tenant_id, // ✅ Add tenant filter
			organization_id: tenantUserPayload.organization_id, // ✅ Add org filter
		},
	});

	// 1️⃣ Contacted → create new customer (inactive)
	if (oldStatus !== 'contacted' && newStatus === 'contacted') {
		if (!customer) {
			customer = await Customer.create({
				customer_id: await generateCustomerId(tenantUserPayload.tenant_id),
				tenant_id: tenantUserPayload.tenant_id,
				organization_id: tenantUserPayload.organization_id,
				name: estimate.customer_name,
				phone: estimate.phone,
				email: estimate.email,
				address: estimate.address,
				status: 'inactive',
				orders: 0,
				total_spent: 0,
				last_order: null,
			});
		}
	}

	// 2️⃣ Paid / Couriered / Delivered → customer active
	if (['paid', 'couriered', 'delivered'].includes(newStatus) && customer) {
		/* Feature Create Invoice ID
		// Generate invoice_id if status is paid and not already present
		if (newStatus === 'paid' && !estimate.invoice_id) {
			const invoiceId = await generateInvoiceId();
			await estimate.update({ invoice_id: invoiceId });
		}*/

		// Only increment orders and total_spent if oldStatus was not counted
		if (!['paid', 'couriered', 'delivered'].includes(oldStatus)) {
			await customer.update({
				status: 'active',
				orders: customer.orders + 1,
				total_spent: Number(customer.total_spent) + Number(estimate.total_amount),
				last_order: new Date(),
			});
		} else {
			// Already counted → just update status and last_order
			await customer.update({
				status: 'active',
				last_order: new Date(),
			});
		}
	}

	// 3️⃣ Canceled / Refunded → set customer inactive, adjust orders & total_spent if previously counted
	if (['canceled', 'refunded'].includes(newStatus) && customer) {
		let decrementOrders = 0;
		let subtractTotal = 0;

		if (['paid', 'couriered', 'delivered'].includes(oldStatus)) {
			decrementOrders = 1;
			subtractTotal = Number(estimate.total_amount);
		}

		await customer.update({
			status: 'inactive',
			orders: Math.max(0, customer.orders - decrementOrders),
			total_spent: Math.max(0, Number(customer.total_spent) - subtractTotal),
		});
	}

	// 🔄 Update/Add Estimate Items
	for (const item of payload.product_items) {
		const product = await Product.findOne({
			where: { product_id: item.product_id },
		});
		if (!product) throw createError(`Product not found: ${item.product_id}`, 400);

		const existingItem = await EstimateItem.findOne({
			where: { estimate_id: estimateId, product_id: item.product_id },
		});

		if (existingItem) {
			await existingItem.update({
				name: item.name,
				quantity: item.quantity,
				price: item.price,
				subtotal: item.quantity * item.price,
			});
		} else {
			const itemId = await generateItemId(tenantUserPayload.tenant_id);
			await EstimateItem.create({
				item_id: itemId,
				estimate_id: estimateId,
				product_id: item.product_id,
				name: item.name,
				quantity: item.quantity,
				price: item.price,
				subtotal: item.quantity * item.price,
			});
		}
	}

	return { success: true, message: 'Estimate updated successfully' };
};

// Soft Delete Estimate
exports.deleteEstimate = async (estimateId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'estimate');

	// 1️⃣ Find Estimate
	const estimate = await Estimate.findOne({
		where: { estimate_id: estimateId },
	});
	if (!estimate) throw createError('Estimate not found', 404);

	// 2️⃣ Soft delete all items first
	await EstimateItem.destroy({
		where: { estimate_id: estimateId },
	}); // this will soft-delete if EstimateItem model has paranoid: true

	// 3️⃣ Soft delete Estimate
	await estimate.update({ status: 'deleted' }); // update status field
	await estimate.destroy(); // paranoid soft delete

	return {
		success: true,
		message: 'Estimate and items deleted successfully',
	};
};

// Get One Estimate
exports.getEstimateById = async (tenantUserPayload, estimateId) => {
	await checkPermission(tenantUserPayload, 'estimate');

	const estimate = await Estimate.findOne({
		where: { estimate_id: estimateId },
		include: [{ model: EstimateItem, as: 'items' }],
		paranoid: false, // include deleted for checking
	});

	// First check if estimate exists
	if (!estimate) throw createError('Estimate not found', 404);

	// Then check if deleted
	if (estimate.deletedAt) {
		throw createError('Estimate has been deleted', 404);
	}

	return {
		success: true,
		message: 'Estimate fetched successfully',
		data: formatDatesTime(estimate, { includeDeletedAt: true }),
	};
};

// Get All Estimates (paginated + renamed stats + total value)
exports.getAllEstimates = async (tenantPayload, page = 1, limit = 10) => {
	const { tenant_id, organization_id } = tenantPayload;

	// 1. Permission check
	await checkPermission({ tenant_id, organization_id }, 'estimate');

	// 2. Pagination setup
	const offset = (page - 1) * limit;

	// 3. Fetch paginated estimates
	const { count, rows } = await Estimate.findAndCountAll({
		where: { organization_id },
		paranoid: true,
		include: [
			{
				model: EstimateItem,
				as: 'items',
				paranoid: false,
			},
		],
		order: [['createdAt', 'DESC']],
		limit,
		offset,
		distinct: true, // 👈 this ensures unique estimates are counted
	});

	if (!rows || rows.length === 0) {
		return {
			success: true,
			message: 'No estimates found',
			total_estimates: 0,
			contacted_estimates: 0,
			paid_estimates: 0,
			couriered_estimates: 0,
			delivered_estimates: 0,
			canceled_estimates: 0,
			refunded_estimates: 0,
			total_value: '0.00',
			totalPages: 0,
			data: [],
		};
	}

	// 4. Aggregation counts
	const newCount = rows.filter((e) => e.status === 'new').length;
	const contactedCount = rows.filter((e) => e.status === 'contacted').length;
	const paidCount = rows.filter((e) => e.status === 'paid').length;
	const courieredCount = rows.filter((e) => e.status === 'couriered').length;
	const deliveredCount = rows.filter((e) => e.status === 'delivered').length;
	const canceledCount = rows.filter((e) => e.status === 'canceled').length;
	const refundedCount = rows.filter((e) => e.status === 'refunded').length;

	// 5. Sum total value (entire dataset, not just current page)
	const totalValueResult = await Estimate.findOne({
		where: { organization_id },
		attributes: [
			[sequelize.fn('SUM', sequelize.col('total_amount')), 'total_value_sum'], // 👈 correct column
		],
		raw: true,
	});
	const totalValueSum = parseFloat(totalValueResult.total_value_sum || 0);

	// 6. Return paginated data + renamed dashboard properties
	return {
		success: true,
		message: 'Estimates fetched successfully',
		total_estimates: count,
		new_count: newCount,
		contacted_estimates: contactedCount,
		paid_estimates: paidCount,
		couriered_estimates: courieredCount,
		delivered_estimates: deliveredCount,
		canceled_estimates: canceledCount,
		refunded_estimates: refundedCount,
		total_value: totalValueSum.toFixed(2),
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(rows, { includeDeletedAt: true }),
	};
};

//Public Api
// Create Estimate (Public API)
exports.createEstimatePublic = async (tenantUserPayload, payload) => {
	// 1️⃣ Auto-calculate priority
	let priority = 'low';
	if (payload.total_amount >= 20000) priority = 'high';
	else if (payload.total_amount >= 10000) priority = 'medium';

	// 2️⃣ Generate Estimate ID
	const estimateId = await generateEstimateIdPublic();

	// 3️⃣ Generate Estimate Code (per organization)
	const lastEstimate = await Estimate.findOne({
		where: { organization_id: tenantUserPayload.organization_id },
		attributes: [
			[
				sequelize.literal('MAX(CAST(SUBSTRING(estimate_code, 4) AS UNSIGNED))'),
				'max_code',
			],
		],
		raw: true,
	});

	let nextCode = 'ENQ000001';
	if (lastEstimate && lastEstimate.max_code) {
		const nextNum = parseInt(lastEstimate.max_code, 10) + 1;
		nextCode = 'ENQ' + String(nextNum).padStart(6, '0');
	}

	// 4️⃣ Create Estimate (master record)
	const estimate = await Estimate.create({
		estimate_id: estimateId,
		organization_id: tenantUserPayload.organization_id,
		estimate_code: nextCode, // 👈 new field
		customer_name: payload.customer_name,
		phone: payload.phone,
		email: payload.email,
		address: payload.address,
		state: payload.state,
		city: payload.city,
		postal_code: payload.postal_code,
		message: payload.message,
		priority,
		status: 'new',
		notes: payload.notes,
		total_price: payload.total_price,
		discount: payload.discount,
		total_amount: payload.total_amount,
	});

	// 5️⃣ Create Estimate Items
	for (const item of payload.product_items) {
		const productExists = await Product.findOne({
			where: { product_id: item.product_id },
		});
		if (!productExists) {
			throw createError(`Product not found: ${item.product_id}`, 404);
		}

		const itemId = await generateItemId();
		await EstimateItem.create({
			item_id: itemId,
			estimate_id: estimateId,
			product_id: item.product_id,
			name: item.name,
			quantity: item.quantity,
			price: item.price,
			subtotal: (item.quantity || 1) * (item.price || 0),
		});
	}

	// 6️⃣ Fetch created estimate with items
	const createdEstimate = await Estimate.findOne({
		where: { estimate_id: estimateId },
		include: [{ model: EstimateItem, as: 'items' }],
	});

	return {
		success: true,
		message: 'Online Estimate created successfully',
		data: formatDatesTime(createdEstimate),
	};
};
