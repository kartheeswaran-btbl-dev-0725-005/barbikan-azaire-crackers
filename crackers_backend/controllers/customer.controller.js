const customerService = require('../services/customer.service');
const { CustomerDTO } = require('../dtos/customer.dto');

// Create Customer
exports.create = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};
		const customerPayload = CustomerDTO(req);
		const result = await customerService.createCustomer(
			customerPayload,
			tenantPayload
		);

		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Customer
exports.update = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};
		const updatePayload = CustomerDTO(req);
		const { customerId } = req.params;

		const result = await customerService.updateCustomer(
			customerId,
			updatePayload,
			tenantPayload
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Soft Delete Customer
exports.delete = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};
		const { customerId } = req.params;

		const result = await customerService.deleteCustomer(
			customerId,
			tenantPayload
		);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Customer
exports.getOne = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};
		const { customerId } = req.params;

		const result = await customerService.getCustomerById(
			customerId,
			tenantPayload
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Customers
exports.getAll = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await customerService.getAllCustomers(
			tenantPayload,
			page,
			limit
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
