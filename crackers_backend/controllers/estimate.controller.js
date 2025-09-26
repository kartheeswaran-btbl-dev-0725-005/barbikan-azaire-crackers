const estimateService = require('../services/estimate.service');
const { EstimateDTO } = require('../dtos/estimate.dto');

// Create Estimate
exports.create = async (req, res) => {
	try {
		const dto = EstimateDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await estimateService.createEstimate(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Estimate
exports.update = async (req, res) => {
	try {
		const dto = EstimateDTO(req);
		const userPayload = {
			tenant_id: req.params.tenantId,
			organization_id: dto.organization_id,
		};
		const { estimateId } = req.params;

		const result = await estimateService.updateEstimate(
			estimateId,
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

// Soft Delete Estimate
exports.delete = async (req, res) => {
	try {
		const dto = EstimateDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { estimateId } = req.params;

		const result = await estimateService.deleteEstimate(estimateId, userPayload);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Estimate
exports.getById = async (req, res) => {
	try {
		const dto = EstimateDTO(req);
		const userPayload = {
			tenant_id: req.params.tenantId,
			organization_id: dto.organization_id,
		};
		const { estimateId } = req.params;

		const result = await estimateService.getEstimateById(userPayload, estimateId);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Estimates
exports.getAll = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};

		// Pagination query params
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await estimateService.getAllEstimates(
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

// Public APIs
// Create Estimate
exports.createPublic = async (req, res) => {
	try {
		const dto = EstimateDTO(req);
		const userPayload = {
			organization_id: dto.organization_id,
		};

		const result = await estimateService.createEstimatePublic(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
