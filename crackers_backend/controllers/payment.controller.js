const paymentService = require('../services/payment.service');
const { PaymentMethodDTO } = require('../dtos/payment.dto');

// Create Payment
exports.create = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await paymentService.createPayment(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Payment
exports.update = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { paymentId } = req.params;

		const result = await paymentService.updatePayment(
			paymentId,
			dto,
			userPayload
		);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Delete Payment
exports.delete = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { paymentId } = req.params;

		const result = await paymentService.deletePayment(paymentId, userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Payment
exports.getById = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { paymentId } = req.params;

		const result = await paymentService.getPaymentById(userPayload, paymentId);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Payments
exports.getAll = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await paymentService.getAllPayments(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Public Controller
// Get All Payment Methods
exports.getAllPublic = async (req, res) => {
	try {
		const dto = PaymentMethodDTO(req);
		const userPayload = { organization_id: dto.organization_id };
		const result = await paymentService.getAllPaymentsPublic(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res
			.status(error.statusCode || 500)
			.json({ success: false, message: error.message || 'Internal Server Error' });
	}
};
