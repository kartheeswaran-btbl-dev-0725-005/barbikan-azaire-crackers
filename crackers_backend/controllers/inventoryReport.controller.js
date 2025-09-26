const inventoryService = require('../services/inventoryReport.service');

exports.getAll = async (req, res) => {
	try {
		const { tenantId, organizationId, fromDate, toDate } = req.params;

		const tenantPayload = {
			tenant_id: tenantId,
			organization_id: organizationId,
		};

		const result = await inventoryService.getInventoryReport(
			tenantPayload,
			fromDate,
			toDate
		);

		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
