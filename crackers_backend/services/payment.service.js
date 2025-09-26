const { Payment } = require('../models');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generatePaymentId } = require('../utils/idGenerator.util');
const {
	createPaymentSchema,
	updatePaymentSchema,
} = require('../validations/payment.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Create Payment
exports.createPayment = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'payment');

	// Validate
	const { error } = createPaymentSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Generate payment ID
	const paymentId = await generatePaymentId();

	// Create payment
	const payment = await Payment.create({
		payment_id: paymentId,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
		type: payload.type,
		account_owner: payload.account_owner,
		phone_number: payload.phone_number || null,
		bank_name: payload.bank_name || null,
		account_number: payload.account_number || null,
		ifsc_code: payload.ifsc_code || null,
		upi_id: payload.upi_id || null,
		qr_code: payload.qr_code || null,
		status: payload.status || 'active',
	});

	return {
		success: true,
		message: 'Payment method created successfully',
		data: formatDatesTime(payment),
	};
};

// Update Payment
exports.updatePayment = async (paymentId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			payment_id: paymentId,
		},
	});
	if (!payment) throw createError('Payment method not found', 404);

	// Validate
	const { error } = updatePaymentSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	await payment.update({
		type: payload.type,
		account_owner: payload.account_owner,
		phone_number: payload.phone_number || payment.phone_number,
		bank_name: payload.bank_name || payment.bank_name,
		account_number: payload.account_number || payment.account_number,
		ifsc_code: payload.ifsc_code || payment.ifsc_code,
		upi_id: payload.upi_id || payment.upi_id,
		qr_code: payload.qr_code || payment.qr_code,
		status: payload.status || payment.status,
	});

	return {
		success: true,
		message: 'Payment method updated successfully',
		data: formatDatesTime(payment),
	};
};

// Delete Payment (soft delete)
exports.deletePayment = async (paymentId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			payment_id: paymentId,
		},
	});
	if (!payment) throw createError('Payment method not found', 404);

	await payment.update({ status: 'deleted' });
	await payment.destroy(); // soft delete

	return {
		success: true,
		message: 'Payment method deleted successfully',
	};
};

// Get One Payment
exports.getPaymentById = async (tenantUserPayload, paymentId) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
			payment_id: paymentId,
		},
		paranoid: true,
	});

	if (!payment) throw createError('Payment method not found', 404);

	return {
		success: true,
		message: 'Payment fetched successfully',
		data: formatDatesTime(payment),
	};
};

// Get All Payments
exports.getAllPayments = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payments = await Payment.findAll({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
		order: [['createdAt', 'ASC']],
		paranoid: true,
	});

	const deletedCount = payments.filter((p) => p.deletedAt !== null).length;

	return {
		success: true,
		message: 'Payments fetched successfully',
		payment_count: payments.length,
		deleted_count: deletedCount,
		data: formatDatesTime(payments),
	};
};

// //Public Service
// // Get All Payments
// exports.getAllPaymentsPublic = async (tenantUserPayload) => {
// 	try {
// 		const { organization_id } = tenantUserPayload;

// 		// ✅ Fetch only organization-specific payments
// 		const payments = await Payment.findAll({
// 			where: { organization_id },
// 			include: [
// 				{ model: BankPayment, as: 'bankDetails' },
// 				{ model: UpiPayment, as: 'upiDetails' },
// 			],
// 			order: [['createdAt', 'ASC']],
// 			paranoid: true,
// 		});

// 		// ✅ Normalize response
// 		const normalized = payments.map((p) => {
// 			let details = null;

// 			if (p.bankDetails) {
// 				details = {
// 					type: 'bank_transfer',
// 					bank_name: p.bankDetails.bank_name,
// 					account_number: p.bankDetails.account_number,
// 					ifsc_code: p.bankDetails.ifsc_code,
// 				};
// 			} else if (p.upiDetails) {
// 				details = {
// 					type: 'upi',
// 					upi_id: p.upiDetails.upi_id,
// 					qr_code: p.upiDetails.qr_code,
// 					bank_name: p.upiDetails.bank_name,
// 				};
// 			}

// 			return {
// 				payment_id: p.payment_id,
// 				organization_id: p.organization_id,
// 				tenant_id: p.tenant_id,
// 				account_owner: p.account_owner,
// 				phone_number: p.phone_number,
// 				status: p.deletedAt ? 'deleted' : 'active',
// 				createdAt: p.createdAt,
// 				updatedAt: p.updatedAt,
// 				deletedAt: p.deletedAt,
// 				payment_details: details, // unified field
// 			};
// 		});

// 		return {
// 			success: true,
// 			message: 'Payments fetched successfully',
// 			data: formatDatesTime(normalized),
// 		};
// 	} catch (error) {
// 		console.error('Error fetching payments:', error);
// 		throw {
// 			statusCode: 500,
// 			message: 'Failed to fetch payments',
// 		};
// 	}
// };
