const {
	Quotation,
	QuotationItem,
	Product,
	Sales,
	Customer,
} = require('../models');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const {
	generateItemId,
	generateInvoiceId,
	generateCustomerId,
} = require('../utils/idGenerator.util');
const {
	createQuotationSchema,
	updateQuotationSchema,
} = require('../validations/quotation.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Create Quotation (offline, customer pays immediately → Sales is created)
exports.createQuotation = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'quotation');
	// Joi Validation
	const { error } = createQuotationSchema.validate({
		...payload,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
	});
	if (error) throw createError(error.details[0].message, 400);

	for (const item of payload.items) {
		const productExists = await Product.findOne({
			where: { product_id: item.product_id },
		});
		if (!productExists) {
			throw createError(`Product not found: ${item.product_id}`, 404);
		}
	}
	// Create Quotation
	const quotation = await Quotation.create({
		quotation_id: payload.quotation_id,
		tenant_id: payload.tenant_id,
		organization_id: payload.organization_id,
		customer_name: payload.customer_name,
		phone: payload.phone,
		address: payload.address,
		date: payload.date,
		valid_until: payload.valid_until,
		notes: payload.notes,
		total_amount: payload.total_amount,
		status: 'paid',
	});
	for (const item of payload.items) {
		const itemId = await generateItemId();
		await QuotationItem.create({
			item_id: itemId,
			quotation_id: quotation.quotation_id,
			product_id: item.product_id,
			product_name: item.product_name,
			price: item.price,
			quantity: item.quantity,
			total: item.total,
		});
	}
	// 4️⃣ Create Sales immediately (offline → customer already paid)
	const invoiceId = await generateInvoiceId();
	const sales = await Sales.create({
		invoice_id: invoiceId,
		tenant_id: quotation.tenant_id,
		organization_id: quotation.organization_id,
		customer_name: quotation.customer_name,
		phone: quotation.phone,
		address: quotation.address,
		date: new Date(),
		total_amount: quotation.total_amount,
		payment_method: 'cash',
		status: 'paid',
	});
	await quotation.update({ invoice_id: invoiceId });

	// 5️⃣ Create or update Customer
	const existingCustomer = await Customer.findOne({
		where: { phone: quotation.phone },
	});
	if (!existingCustomer) {
		await Customer.create({
			customer_id: await generateCustomerId(),
			tenant_id: quotation.tenant_id,
			organization_id: quotation.organization_id,
			name: quotation.customer_name,
			phone: quotation.phone,
			address: quotation.address,
			status: 'offline',
			orders: 1,
			total_spent: quotation.total_amount,
			last_order: new Date(),
		});
	} else {
		await existingCustomer.update({
			orders: existingCustomer.orders + 1,
			total_spent:
				Number(existingCustomer.total_spent) + Number(quotation.total_amount),
			last_order: new Date(),
			status: 'offline',
		});
	}

	// 6️⃣ Fetch Quotation with items
	const createdQuotation = await Quotation.findOne({
		where: { quotation_id: payload.quotation_id },
		include: [{ model: QuotationItem, as: 'items' }],
	});

	return {
		success: true,
		message: 'Quotation created successfully',
		data: formatDatesTime(createdQuotation),
	};
};

// Update Quotation (normally offline quotations are closed, but still allow edit)
exports.updateQuotation = async (quotationId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'quotation');

	const quotation = await Quotation.findOne({
		where: { quotation_id: quotationId },
	});
	if (!quotation) throw createError('Quotation not found', 404);

	// Joi validation
	const { error } = updateQuotationSchema.validate(
		{
			...payload,
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		{ stripUnknown: true }
	);

	if (error) throw createError(error.details[0].message, 400);

	delete payload.tenant_id;
	delete payload.organization_id;

	// Update Quotation fields
	await quotation.update({
		customer_name: payload.customer_name,
		phone: payload.phone,
		address: payload.address,
		date: payload.date,
		valid_until: payload.valid_until,
		notes: payload.notes,
		total_amount: payload.total_amount,
	});

	// Update Quotation Items
	for (const item of payload.items) {
		const product = await Product.findOne({
			where: { product_id: item.product_id },
		});
		if (!product) throw createError(`Product not found: ${item.product_id}`, 400);
		const existingItem = await QuotationItem.findOne({
			where: { quotation_id: quotationId, product_id: item.product_id },
		});
		if (existingItem) {
			await existingItem.update({
				product_name: item.product_name,
				price: item.price,
				quantity: item.quantity,
				total: item.total,
			});
		} else {
			const itemId = await generateItemId(tenantUserPayload.tenant_id);
			await QuotationItem.create({
				item_id: itemId,
				quotation_id: quotationId,
				product_id: item.product_id,
				product_name: item.product_name,
				price: item.price,
				quantity: item.quantity,
				total: item.total,
			});
		}
	}

	return {
		success: true,
		message: 'Quotation updated successfully',
	};
};

// Delete Quotation (soft delete)
exports.deleteQuotation = async (quotationId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'quotation');

	const quotation = await Quotation.findOne({
		where: { quotation_id: quotationId },
	});
	if (!quotation) throw createError('Quotation not found', 404);

	// Soft delete quotation + items
	await QuotationItem.destroy({ where: { quotation_id: quotationId } });
	await quotation.update({ status: 'deleted' });
	await quotation.destroy();

	return {
		success: true,
		message: 'Quotation and items deleted successfully',
	};
};

// Get One Quotation
exports.getQuotationById = async (tenantUserPayload, quotationId) => {
	await checkPermission(tenantUserPayload, 'quotation');

	const quotation = await Quotation.findOne({
		where: { quotation_id: quotationId },
		include: [{ model: QuotationItem, as: 'items' }],
		paranoid: false,
	});

	if (!quotation) throw createError('Quotation not found', 404);
	if (quotation.deletedAt) throw createError('Quotation has been deleted', 404);

	return {
		success: true,
		message: 'Quotation fetched successfully',
		data: formatDatesTime(quotation, { includeDeletedAt: true }),
	};
};

// Get All Quotations
exports.getAllQuotations = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'quotation');

	const quotations = await Quotation.findAll({
		where: { tenant_id: tenantUserPayload.tenant_id },
		paranoid: true,
		include: [{ model: QuotationItem, as: 'items', paranoid: false }],
		order: [['createdAt', 'ASC']],
	});

	if (!quotations || quotations.length === 0) {
		return {
			success: true,
			message: 'No quotations found',
			quotation_count: 0,
			deleted_count: 0,
			data: [],
		};
	}

	const deletedCount = quotations.filter((q) => q.deletedAt !== null).length;

	return {
		success: true,
		message: 'Quotations fetched successfully',
		quotation_count: quotations.length,
		deleted_count: deletedCount,
		data: formatDatesTime(quotations, { includeDeletedAt: true }),
	};
};
