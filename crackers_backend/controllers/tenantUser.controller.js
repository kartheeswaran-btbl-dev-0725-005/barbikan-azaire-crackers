const tenantUserService = require('../services/tenantUser.service');
const { updateTenantUserDto } = require('../dtos/tenantUser.dto');

exports.updateTenantUser = async (req, res) => {
	try {
		const dto = updateTenantUserDto(req);
		const data = await tenantUserService.updateTenantUser(dto);
		res.status(200).json(data);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

exports.getAll = async (req, res) => {
	try {
		const { tenantId, organizationId } = req.params;
		const { page = 1, limit = 10 } = req.query;

		const data = await tenantUserService.getAllTenantUsers({
			tenant_id: tenantId,
			organization_id: organizationId,
			page: parseInt(page),
			limit: parseInt(limit),
		});

		res.status(200).json(data);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
