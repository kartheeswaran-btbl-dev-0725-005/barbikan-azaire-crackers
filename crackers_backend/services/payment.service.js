const { Payment, BankPayment, UpiPayment } = require('../models');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generatePaymentId } = require('../utils/idGenerator.util');
const {
	createBankTransferSchema,
	createUPIPaymentSchema,
} = require('../validations/payment.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');

// Create Payment
exports.createPayment = async (tenantUserPayload, payload) => {
	await checkPermission(tenantUserPayload, 'payment');

	// Validation
	let validation;
	if (payload.type === 'bank_transfer') {
		validation = createBankTransferSchema.validate(payload);
	} else if (payload.type === 'upi') {
		validation = createUPIPaymentSchema.validate(payload);
	} else {
		throw createError('Invalid payment type', 400);
	}
	if (validation.error)
		throw createError(validation.error.details[0].message, 400);

	// Generate payment ID
	const paymentId = await generatePaymentId();

	// Create Payment (base)
	const payment = await Payment.create({
		payment_id: paymentId,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
		type: payload.type,
		account_owner: payload.account_owner,
		bank_name: payload.bank_name,
		phone_number: payload.phone_number || null,
	});

	// Create child record
	if (payload.type === 'bank_transfer') {
		await BankPayment.create({
			payment_id: paymentId,
			bank_name: payload.bank_name,
			account_number: payload.account_number,
			ifsc_code: payload.ifsc_code,
		});
	} else if (payload.type === 'upi') {
		await UpiPayment.create({
			payment_id: paymentId,
			upi_id: payload.upi_id,
			qr_code: payload.qr_code,
			bank_name: payload.bank_name, // <-- Added here
		});
	}

	return {
		success: true,
		message: 'Payment method created successfully',
		data: {
			payment_id: payment.payment_id,
			type: payment.type,
			account_owner: payment.account_owner,
			phone_number: payment.phone_number,
		},
	};
};

// Update Payment
exports.updatePayment = async (paymentId, payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({ where: { payment_id: paymentId } });
	if (!payment) throw createError('Payment method not found', 404);

	// Validate based on type
	let validation;
	if (payload.type === 'bank_transfer') {
		validation = createBankTransferSchema.validate(payload);
	} else if (payload.type === 'upi') {
		validation = createUPIPaymentSchema.validate(payload);
	} else {
		throw createError('Invalid payment type', 400);
	}
	if (validation.error)
		throw createError(validation.error.details[0].message, 400);

	await payment.update({
		account_owner: payload.account_owner,
		bank_name: payload.bank_name,
		phone_number: payload.phone_number || null,
		status: payload.status,
	});

	// Update child
	if (payload.type === 'bank_transfer') {
		const bank = await BankPayment.findOne({ where: { payment_id: paymentId } });
		if (!bank) {
			throw { statusCode: 404, message: 'Bank payment details not found' };
		}
		await bank.update({
			bank_name: payload.bank_name,
			account_number: payload.account_number,
			ifsc_code: payload.ifsc_code,
		});
	} else if (payload.type === 'upi') {
		const upi = await UpiPayment.findOne({ where: { payment_id: paymentId } });
		if (!upi) {
			throw { statusCode: 404, message: 'UPI payment details not found' };
		}
		await upi.update({
			upi_id: payload.upi_id,
			qr_code: payload.qr_code,
			bank_name: payload.bank_name,
		});
	}

	return {
		success: true,
		message: 'Payment method updated successfully',
	};
};

// Delete Payment (soft delete)
exports.deletePayment = async (paymentId, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({ where: { payment_id: paymentId } });
	if (!payment) throw createError('Payment method not found', 404);

	await payment.update({ status: 'deleted' });
	await payment.destroy(); // paranoid soft delete

	return {
		success: true,
		message: 'Payment method deleted successfully',
	};
};

// Get One Payment
exports.getPaymentById = async (tenantUserPayload, paymentId) => {
	await checkPermission(tenantUserPayload, 'payment');

	const payment = await Payment.findOne({
		where: { payment_id: paymentId },
		include: [
			{ model: BankPayment, as: 'bankDetails' },
			{ model: UpiPayment, as: 'upiDetails' },
		],
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
		include: [
			{ model: BankPayment, as: 'bankDetails' },
			{ model: UpiPayment, as: 'upiDetails' },
		],
		order: [['createdAt', 'ASC']],
		paranoid: true,
	});

	// Count deleted
	const deletedCount = payments.filter((p) => p.deletedAt !== null).length;

	// Normalize response for frontend
	const normalized = payments.map((p) => {
		let details = null;

		if (p.bankDetails) {
			details = {
				type: 'bank_transfer',
				bank_name: p.bankDetails.bank_name,
				account_number: p.bankDetails.account_number,
				ifsc_code: p.bankDetails.ifsc_code,
			};
		} else if (p.upiDetails) {
			details = {
				type: 'upi',
				upi_id: p.upiDetails.upi_id,
				qr_code: p.upiDetails.qr_code,
				bank_name: p.upiDetails.bank_name,
			};
		}

		return {
			payment_id: p.payment_id,
			tenant_id: p.tenant_id,
			organization_id: p.organization_id,
			account_owner: p.account_owner,
			phone_number: p.phone_number,
			status: p.deletedAt ? 'deleted' : 'active',
			createdAt: p.createdAt,
			updatedAt: p.updatedAt,
			deletedAt: p.deletedAt,
			payment_details: details, // 👈 common field
		};
	});

	return {
		success: true,
		message: 'Payments fetched successfully',
		payment_count: payments.length,
		deleted_count: deletedCount,
		data: formatDatesTime(normalized),
	};
};

//Public Service
// Get All Payments
exports.getAllPaymentsPublic = async (tenantUserPayload) => {
	try {
		const { organization_id } = tenantUserPayload;

		// ✅ Fetch only organization-specific payments
		const payments = await Payment.findAll({
			where: { organization_id },
			include: [
				{ model: BankPayment, as: 'bankDetails' },
				{ model: UpiPayment, as: 'upiDetails' },
			],
			order: [['createdAt', 'ASC']],
			paranoid: true,
		});

		// ✅ Normalize response
		const normalized = payments.map((p) => {
			let details = null;

			if (p.bankDetails) {
				details = {
					type: 'bank_transfer',
					bank_name: p.bankDetails.bank_name,
					account_number: p.bankDetails.account_number,
					ifsc_code: p.bankDetails.ifsc_code,
				};
			} else if (p.upiDetails) {
				details = {
					type: 'upi',
					upi_id: p.upiDetails.upi_id,
					qr_code: p.upiDetails.qr_code,
					bank_name: p.upiDetails.bank_name,
				};
			}

			return {
				payment_id: p.payment_id,
				organization_id: p.organization_id,
				tenant_id: p.tenant_id,
				account_owner: p.account_owner,
				phone_number: p.phone_number,
				status: p.deletedAt ? 'deleted' : 'active',
				createdAt: p.createdAt,
				updatedAt: p.updatedAt,
				deletedAt: p.deletedAt,
				payment_details: details, // unified field
			};
		});

		return {
			success: true,
			message: 'Payments fetched successfully',
			data: formatDatesTime(normalized),
		};
	} catch (error) {
		console.error('Error fetching payments:', error);
		throw {
			statusCode: 500,
			message: 'Failed to fetch payments',
		};
	}
};
