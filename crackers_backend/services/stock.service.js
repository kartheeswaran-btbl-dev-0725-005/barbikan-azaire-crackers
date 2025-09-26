const { Product, StockLog, Category } = require('../models');
const { createStockSchema } = require('../validations/stock.validation');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generateTransactionId } = require('../utils/idGenerator.util');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Map transaction types to IN/OUT
const IN_TYPES = [
	'purchase_in',
	'sales_return_in',
	'transfer_in',
	'adjustment_in',
];
const OUT_TYPES = [
	'sale_out',
	'purchase_return_out',
	'damage_out',
	'loss_out',
	'transfer_out',
	'adjustment_out',
];

// Create Stock Transaction
exports.createStockTransaction = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'stock');

	// Validate request body
	const { error, value } = createStockSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Find product
	const product = await Product.findOne({
		where: { product_id: value.product_id },
	});
	if (!product) throw createError('Product not found', 404);

	let newStock = parseInt(product.stock_quantity);
	const qty = parseInt(value.quantity);

	// Adjust stock
	if (IN_TYPES.includes(value.transaction_type)) {
		newStock += qty;
	} else if (OUT_TYPES.includes(value.transaction_type)) {
		if (newStock < qty) throw createError('Insufficient stock', 400);
		newStock -= qty;
	} else {
		throw createError('Invalid transaction type', 400);
	}

	// Generate transaction ID
	const transactionId = await generateTransactionId();

	// Save transaction
	const transaction = await StockLog.create({
		tenant_id: value.tenant_id,
		organization_id: value.organization_id,
		transaction_id: transactionId,
		product_id: value.product_id,
		transaction_type: value.transaction_type,
		quantity: qty,
		reason: value.reason,
		created_by: value.tenant_id, // (replace with actual user_id if needed)
	});

	// Update product stock
	await product.update({ stock_quantity: newStock });

	return {
		success: true,
		message: 'Stock transaction recorded successfully',
		data: {
			transaction_id: transaction.transaction_id,
			product_id: product.product_id,
			product_name: product.product_name,
			transaction_type: transaction.transaction_type,
			quantity: transaction.quantity,
			reason: transaction.reason,
			created_by: transaction.created_by,
			current_stock: newStock, // 👈 return only in create API
		},
	};
};

// Get All Stock Transactions
exports.getAllStockTransactions = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'stock');

	const transactions = await StockLog.findAll({
		order: [['createdAt', 'ASC']],
		paranoid: true,
		include: [
			{
				model: Product,
				as: 'product',
				attributes: ['name'], // only fetch product name
			},
		],
	});

	if (!transactions.length) {
		return {
			success: true,
			message: 'No stock transactions found',
			data: [],
			count: 0,
			deletedCount: 0,
		};
	}

	const deletedCount = transactions.filter((t) => t.deletedAt !== null).length;
	const activeCount = transactions.length - deletedCount;

	// Format response
	const formattedData = transactions.map((tx) => ({
		transaction_id: tx.transaction_id,
		product_id: tx.product_id,
		product_name: tx.product?.name || null,
		transaction_type: tx.transaction_type,
		quantity: tx.quantity,
		reason: tx.reason,
		created_by: tx.created_by,
		createdAt: tx.createdAt,
		updatedAt: tx.updatedAt,
		deletedAt: tx.deletedAt,
	}));

	return {
		success: true,
		message: 'Stock transactions fetched successfully',
		transaction_count: transactions.length,
		activeCount,
		deletedCount,
		data: formatDatesTime(formattedData),
	};
};
