const quotationService = require('../services/quotation.service');
const { QuotationDTO } = require('../dtos/quotation.dto');

// Create Quotation
exports.create = async (req, res) => {
	try {
		const dto = QuotationDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await quotationService.createQuotation(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Quotation
exports.update = async (req, res) => {
	try {
		const dto = QuotationDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { quotationId } = req.params;

		const result = await quotationService.updateQuotation(
			quotationId,
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

// Soft Delete Quotation
exports.delete = async (req, res) => {
	try {
		const dto = QuotationDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { quotationId } = req.params;

		const result = await quotationService.deleteQuotation(
			quotationId,
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

// Get One Quotation
exports.getById = async (req, res) => {
	try {
		const dto = QuotationDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { quotationId } = req.params;

		const result = await quotationService.getQuotationById(
			userPayload,
			quotationId
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Quotations
exports.getAll = async (req, res) => {
	try {
		const dto = QuotationDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await quotationService.getAllQuotations(userPayload);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
