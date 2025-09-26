const {
	TenantUser,
	Customer,
	Category,
	Product,
	StockLog,
	Payment,
	Store,
	Estimate,
	EstimateItem,
	Sales,
	QuotationItem,
	sequelize,
} = require('../models');

const crypto = require('crypto');

// -------------------------
// User
// -------------------------
async function generateUserId() {
	const lastUser = await TenantUser.findOne({
		attributes: ['user_id'],
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let next = 1;
	if (lastUser?.user_id) {
		const numericPart = parseInt(lastUser.user_id.replace(/^USR/, ''), 10);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}

	return `USR${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Customer
// -------------------------
async function generateCustomerId() {
	const lastCustomer = await Customer.findOne({
		attributes: ['customer_id'],
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let next = 1;
	if (lastCustomer?.customer_id) {
		const numericPart = parseInt(
			lastCustomer.customer_id.replace(/^CUS/, ''),
			10
		);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}
	return `CUS${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Category
// -------------------------
async function generateCategoryId() {
	const lastCategory = await Category.findOne({
		attributes: [[sequelize.fn('MAX', sequelize.col('category_id')), 'maxId']],
		raw: true,
		paranoid: false,
	});

	let next = 1;
	if (lastCategory?.maxId) {
		const numericPart = parseInt(lastCategory.maxId.replace(/^CAT/, ''), 10);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}

	return `CAT${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Product
// -------------------------
async function generateProductId() {
	const lastProduct = await Product.findOne({
		attributes: [[sequelize.fn('MAX', sequelize.col('product_id')), 'maxId']],
		raw: true,
		paranoid: false,
	});

	let next = 1;
	if (lastProduct?.maxId) {
		const numericPart = parseInt(lastProduct.maxId.replace(/^PRD/, ''), 10);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}

	return `PRD${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Transaction
// -------------------------
async function generateTransactionId() {
	const lastTransaction = await StockLog.findOne({
		attributes: ['transaction_id'],
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let next = 1;
	if (lastTransaction?.transaction_id) {
		const numericPart = parseInt(
			lastTransaction.transaction_id.replace(/^TRX/, ''),
			10
		);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}

	return `TRX${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Payment
// -------------------------
async function generatePaymentId() {
	const lastPayment = await Payment.findOne({
		attributes: ['payment_id'],
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let next = 1;
	if (lastPayment?.payment_id) {
		const numericPart = parseInt(lastPayment.payment_id.replace(/^PAY/, ''), 10);
		if (!isNaN(numericPart)) next = numericPart + 1;
	}

	return `PAY${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Store
// -------------------------
async function generateStoreId() {
	const timestamp = Date.now().toString(36); // base36 timestamp
	const randomPart = crypto.randomBytes(3).toString('hex'); // 6 chars
	return `store-${timestamp}${randomPart}`;
}

// -------------------------
// Estimate (internal)
// -------------------------
async function generateEstimateId() {
	const lastEstimate = await Estimate.findOne({
		attributes: ['estimate_id'],
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let next = 1;
	if (lastEstimate?.estimate_id) {
		const numeric = parseInt(lastEstimate.estimate_id.replace(/^ENQ/, ''), 10);
		if (!isNaN(numeric)) next = numeric + 1;
	}

	return `ENQ${next.toString().padStart(6, '0')}`;
}

// -------------------------
// Estimate Item / Quotation Item
// -------------------------
async function generateItemId() {
	const [estimateItem, quotationItem] = await Promise.all([
		EstimateItem.findOne({
			attributes: ['item_id'],
			order: [['item_id', 'DESC']],
			paranoid: false,
		}),
		QuotationItem.findOne({
			attributes: ['item_id'],
			order: [['item_id', 'DESC']],
			paranoid: false,
		}),
	]);

	const extract = (id) => (id ? parseInt(id.replace(/\D/g, ''), 10) || 0 : 0);

	const maxNumber = Math.max(
		extract(estimateItem?.item_id),
		extract(quotationItem?.item_id)
	);

	return `ITM${String(maxNumber + 1).padStart(6, '0')}`;
}

// -------------------------
// Invoice
// -------------------------
async function generateInvoiceId() {
	const lastSale = await Sales.findOne({
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let nextNumber = 1;
	if (lastSale?.invoice_id) {
		const numeric = parseInt(lastSale.invoice_id.replace(/^\D+/, ''), 10);
		if (!isNaN(numeric)) nextNumber = numeric + 1;
	}

	return `INV${nextNumber.toString().padStart(6, '0')}`;
}

// -------------------------
// Public Estimate
// -------------------------
async function generateEstimateIdPublic() {
	const lastEstimate = await Estimate.findOne({
		order: [['createdAt', 'DESC']],
		paranoid: false,
	});

	let nextNumber = 1;
	if (lastEstimate?.estimate_id) {
		const numeric = parseInt(lastEstimate.estimate_id.replace(/^\D+/, ''), 10);
		if (!isNaN(numeric)) nextNumber = numeric + 1;
	}

	return `ENQ${nextNumber.toString().padStart(6, '0')}`;
}

module.exports = {
	generateUserId,
	generateCustomerId,
	generateCategoryId,
	generateProductId,
	generateTransactionId,
	generatePaymentId,
	generateStoreId,
	generateEstimateId,
	generateItemId,
	generateInvoiceId,
	generateEstimateIdPublic,
};
