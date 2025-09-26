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
const { Op } = require('sequelize');

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

	// :one: Auto-calculate priority based on total_amount
	let priority = 'low';
	if (payload.total_amount >= 20000) {
		priority = 'high';
	} else if (payload.total_amount >= 10000) {
		priority = 'medium';
	}

	// :two: Generate Estimate ID
	const estimateId = await generateEstimateId();

	// :three: Create Estimate (master record)
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
		priority, // :point_left: calculated automatically
		status: 'pending',
		notes: payload.notes,
		total_price: payload.total_price,
		discount: payload.discount,
		total_amount: payload.total_amount,
	});

	// :four: Create Estimate Items (details)
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

	// :five: Fetch created estimate with items
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

// Update Estimate (transaction-safe, production-ready)
exports.updateEstimate = async (estimateId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'estimate');

	return await sequelize.transaction(async (t) => {
		// 1) Fetch estimate with lock
		const estimate = await Estimate.findOne({
			where: {
				organization_id: tenantUserPayload.organization_id,
				estimate_id: estimateId,
			},
			transaction: t,
			lock: t.LOCK.UPDATE,
		});
		if (!estimate) throw createError('Estimate not found', 404);

		const oldStatus = estimate.status; // capture BEFORE update

		// 2) Joi validation
		const { error } = updateEstimateSchema.validate({
			...payload,
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		});
		if (error) throw createError(error.details[0].message, 400);

		// Prevent override
		delete payload.tenant_id;
		delete payload.organization_id;

		// 3) Update estimate base fields
		await estimate.update(
			{
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
			},
			{ transaction: t }
		);

		const newStatus = payload.status;

		// 4) CUSTOMER SYNC
		let customer = await Customer.findOne({
			where: {
				tenant_id: tenantUserPayload.tenant_id,
				organization_id: tenantUserPayload.organization_id,
				phone: estimate.phone,
			},
			transaction: t,
			lock: t.LOCK.UPDATE,
		});

		let customerJustCreatedAndCounted = false;

		// --- helper to generate new customer ---
		const createNewCustomer = async (status, orders = 0, spent = 0) => {
			const customerId = await generateCustomerId(t);

			const lastCustomer = await Customer.findOne({
				where: { organization_id: tenantUserPayload.organization_id },
				attributes: [
					[
						sequelize.literal('MAX(CAST(SUBSTRING(customer_code, 4) AS UNSIGNED))'),
						'max_code',
					],
				],
				raw: true,
				transaction: t,
				lock: t.LOCK.UPDATE,
			});

			let nextCode = 'CUS000001';
			if (lastCustomer && lastCustomer.max_code) {
				const nextNum = parseInt(lastCustomer.max_code, 10) + 1;
				nextCode = 'CUS' + String(nextNum).padStart(6, '0');
			}

			return Customer.create(
				{
					tenant_id: tenantUserPayload.tenant_id,
					organization_id: tenantUserPayload.organization_id,
					customer_id: customerId,
					customer_code: nextCode,
					name: estimate.customer_name,
					phone: estimate.phone,
					email: estimate.email,
					address: estimate.address,
					status,
					orders,
					total_spent: spent,
					last_order: orders > 0 ? new Date() : null,
				},
				{ transaction: t }
			);
		};

		// If no customer exists, create depending on newStatus
		if (!customer) {
			if (newStatus === 'contacted') {
				customer = await createNewCustomer('inactive', 0, 0);
			}
			if (['paid', 'couriered', 'delivered'].includes(newStatus)) {
				customer = await createNewCustomer(
					'active',
					1,
					Number(estimate.total_amount || 0)
				);
				customerJustCreatedAndCounted = true;
			}
			if (['canceled', 'refunded'].includes(newStatus)) {
				customer = await createNewCustomer('inactive', 0, 0);
			}
		}

		// 4.2) Paid / Couriered / Delivered (for existing customers)
		if (['paid', 'couriered', 'delivered'].includes(newStatus) && customer) {
			const wasPreviouslyCounted = ['paid', 'couriered', 'delivered'].includes(
				oldStatus
			);

			if (!wasPreviouslyCounted && !customerJustCreatedAndCounted) {
				// :white_check_mark: First time moving into paid-like status
				await customer.update(
					{
						status: 'active',
						orders: (customer.orders || 0) + 1,
						total_spent:
							Number(customer.total_spent || 0) + Number(estimate.total_amount || 0),
						last_order: new Date(),
					},
					{ transaction: t }
				);
			} else {
				// :white_check_mark: Already counted before → just refresh last_order
				await customer.update(
					{
						status: 'active',
						last_order: new Date(),
					},
					{ transaction: t }
				);
			}
		}

		// 4.3) Canceled / Refunded
		if (['canceled', 'refunded'].includes(newStatus) && customer) {
			let decrementOrders = 0;
			let subtractTotal = 0;

			if (['paid', 'couriered', 'delivered'].includes(oldStatus)) {
				decrementOrders = 1;
				subtractTotal = Number(estimate.total_amount || 0);
			}

			await customer.update(
				{
					status: 'inactive',
					orders: Math.max(0, (customer.orders || 0) - decrementOrders),
					total_spent: Math.max(
						0,
						Number(customer.total_spent || 0) - subtractTotal
					),
				},
				{ transaction: t }
			);
		}

		// 5) Estimate Items
		if (Array.isArray(payload.product_items)) {
			for (const item of payload.product_items) {
				const product = await Product.findOne({
					where: {
						organization_id: tenantUserPayload.organization_id,
						product_id: item.product_id,
					},
					transaction: t,
					lock: t.LOCK.UPDATE,
				});
				if (!product)
					throw createError(`Product not found: ${item.product_id}`, 400);

				const existingItem = await EstimateItem.findOne({
					where: { estimate_id: estimateId, product_id: item.product_id },
					transaction: t,
					lock: t.LOCK.UPDATE,
				});

				if (existingItem) {
					await existingItem.update(
						{
							name: item.name,
							quantity: item.quantity,
							price: item.price,
							subtotal: (item.quantity || 0) * (item.price || 0),
						},
						{ transaction: t }
					);
				} else {
					const itemId = await generateItemId(t);
					await EstimateItem.create(
						{
							item_id: itemId,
							estimate_id: estimateId,
							product_id: item.product_id,
							name: item.name,
							quantity: item.quantity,
							price: item.price,
							subtotal: (item.quantity || 0) * (item.price || 0),
						},
						{ transaction: t }
					);
				}
			}
		}

		// 6) Done
		return { success: true, message: 'Estimate updated successfully' };
	});
};

// Soft Delete Estimate
exports.deleteEstimate = async (estimateId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'estimate');

	// :one: Find Estimate
	const estimate = await Estimate.findOne({
		where: {
			organization_id: tenantUserPayload.organization_id,
			estimate_id: estimateId,
		},
	});
	if (!estimate) throw createError('Estimate not found', 404);

	// :two: Soft delete all items first
	await EstimateItem.destroy({
		where: {
			estimate_id: estimateId,
		},
	}); // this will soft-delete if EstimateItem model has paranoid: true

	// :three: Soft delete Estimate
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
		where: {
			organization_id: tenantUserPayload.organization_id,
			estimate_id: estimateId,
		},
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

// Get All Estimates (paginated + filters + stats)
exports.getAllEstimates = async (
	tenantPayload,
	page = 1,
	limit = 10,
	search = null,
	status = null
) => {
	const { tenant_id, organization_id } = tenantPayload;

	// 1. Permission check
	await checkPermission({ tenant_id, organization_id }, 'estimate');

	// 2. Pagination setup
	const offset = (page - 1) * limit;

	// 3. Build filter conditions
	const whereClause = { organization_id };

	if (status) {
		whereClause.status = status;
	}

	if (search) {
		whereClause[Op.or] = [
			{ customer_name: { [Op.like]: `%${search}%` } },
			{ phone: { [Op.like]: `%${search}%` } },
			{ email: { [Op.like]: `%${search}%` } },
			{ estimate_code: { [Op.like]: `%${search}%` } },
		];
	}

	// 4. Fetch paginated estimates
	const { count, rows } = await Estimate.findAndCountAll({
		where: whereClause,
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
		distinct: true,
	});

	// 5. Fetch counts (no search filter, only org scope)
	const allCounts = await Estimate.findAll({
		where: { organization_id },
		attributes: [
			[sequelize.fn('COUNT', sequelize.col('estimate_id')), 'total'],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='new' THEN 1 ELSE 0 END")
				),
				'new_count',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='contacted' THEN 1 ELSE 0 END")
				),
				'contacted_estimates',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='paid' THEN 1 ELSE 0 END")
				),
				'paid_estimates',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='couriered' THEN 1 ELSE 0 END")
				),
				'couriered_estimates',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='delivered' THEN 1 ELSE 0 END")
				),
				'delivered_estimates',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='canceled' THEN 1 ELSE 0 END")
				),
				'canceled_estimates',
			],
			[
				sequelize.fn(
					'SUM',
					sequelize.literal("CASE WHEN status='refunded' THEN 1 ELSE 0 END")
				),
				'refunded_estimates',
			],
		],
		raw: true,
	});

	const counts = allCounts[0] || {};

	// 6. Calculate total_value for only paid, couriered, delivered
	const totalValueResult = await Estimate.findOne({
		where: {
			organization_id,
			status: { [Op.in]: ['paid', 'couriered', 'delivered'] },
		},
		attributes: [
			[sequelize.fn('SUM', sequelize.col('total_amount')), 'total_value_sum'],
		],
		raw: true,
	});
	const totalValueSum = parseFloat(totalValueResult.total_value_sum || 0);

	// 7. Return response
	return {
		success: true,
		message: 'Estimates fetched successfully',
		total_estimates: parseInt(counts.total || 0),
		new_count: parseInt(counts.new_count || 0),
		contacted_estimates: parseInt(counts.contacted_estimates || 0),
		paid_estimates: parseInt(counts.paid_estimates || 0),
		couriered_estimates: parseInt(counts.couriered_estimates || 0),
		delivered_estimates: parseInt(counts.delivered_estimates || 0),
		canceled_estimates: parseInt(counts.canceled_estimates || 0),
		refunded_estimates: parseInt(counts.refunded_estimates || 0),
		total_value: totalValueSum.toFixed(2),
		totalPages: Math.ceil(count / limit),
		data: formatDatesTime(rows, { includeDeletedAt: true }),
	};
};

// Public API
// Create Estimate (Public API)
exports.createEstimatePublic = async (tenantUserPayload, payload) => {
	return await sequelize.transaction(async (t) => {
		// :one: Auto-calculate priority
		let priority = 'low';
		if (payload.total_amount >= 20000) priority = 'high';
		else if (payload.total_amount >= 10000) priority = 'medium';

		// :two: Generate Estimate ID (transaction-safe)
		const estimateId = await generateEstimateIdPublic(t);

		// :three: Generate Estimate Code (per organization, transaction-safe)
		const lastEstimate = await Estimate.findOne({
			where: { organization_id: tenantUserPayload.organization_id },
			attributes: [
				[
					sequelize.literal('MAX(CAST(SUBSTRING(estimate_code, 4) AS UNSIGNED))'),
					'max_code',
				],
			],
			raw: true,
			transaction: t,
			lock: t.LOCK.UPDATE,
		});

		let nextCode = 'ENQ000001';
		if (lastEstimate && lastEstimate.max_code) {
			const nextNum = parseInt(lastEstimate.max_code, 10) + 1;
			nextCode = 'ENQ' + String(nextNum).padStart(6, '0');
		}

		// :four: Validate all products before creating estimate
		for (const item of payload.product_items) {
			const productExists = await Product.findOne({
				where: {
					organization_id: tenantUserPayload.organization_id,
					product_id: item.product_id,
				},
				transaction: t,
				lock: t.LOCK.UPDATE,
			});

			if (!productExists) {
				throw createError(`Product not found: ${item.product_id}`, 404);
			}
		}

		// :five: Create Estimate (master record) - only if all products exist
		const estimate = await Estimate.create(
			{
				estimate_id: estimateId,
				organization_id: tenantUserPayload.organization_id,
				estimate_code: nextCode,
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
			},
			{ transaction: t }
		);

		// :six: Create Estimate Items
		for (const item of payload.product_items) {
			const itemId = await generateItemId(t);
			await EstimateItem.create(
				{
					item_id: itemId,
					estimate_id: estimateId,
					product_id: item.product_id,
					name: item.name,
					quantity: item.quantity,
					price: item.price,
					subtotal: (item.quantity || 1) * (item.price || 0),
				},
				{ transaction: t }
			);
		}

		// :seven: Fetch created estimate with items
		const createdEstimate = await Estimate.findOne({
			where: {
				estimate_id: estimateId,
				organization_id: tenantUserPayload.organization_id,
			},
			include: [{ model: EstimateItem, as: 'items' }],
			transaction: t,
		});

		return {
			success: true,
			message: 'Online Estimate created successfully',
			data: formatDatesTime(createdEstimate),
		};
	});
};
