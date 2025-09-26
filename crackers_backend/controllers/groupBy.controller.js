const groupByService = require('../services/groupBy.service');
const { GroupByDTO } = require('../dtos/groupBy.dto');

// Create
exports.create = async (req, res) => {
	try {
		const dto = GroupByDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const result = await groupByService.createGroupBy(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update
exports.update = async (req, res) => {
	try {
		const dto = GroupByDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { id } = req.params;

		const result = await groupByService.updateGroupBy(id, dto, userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Delete
exports.delete = async (req, res) => {
	try {
		const dto = GroupByDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { id } = req.params;

		const result = await groupByService.deleteGroupBy(id, userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One
exports.getById = async (req, res) => {
	try {
		const dto = GroupByDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};
		const { id } = req.params;

		const result = await groupByService.getGroupByById(userPayload, id);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All
exports.getAll = async (req, res) => {
	try {
		const dto = GroupByDTO(req);
		const tenantPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const result = await groupByService.getAllGroupBy(tenantPayload, page, limit);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
