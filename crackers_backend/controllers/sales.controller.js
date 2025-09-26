const salesService = require('../services/sales.service');

exports.getAll = async (req, res) => {
	try {
		const userPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};

		const result = await salesService.getAllSales(userPayload);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
