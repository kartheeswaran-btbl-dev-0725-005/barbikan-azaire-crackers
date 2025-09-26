const reportService = require('../services/salesReport.service');

// Get Report (Sales Summary)
exports.getAll = async (req, res) => {
	try {
		// tenant/org payload
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};

		// date filters directly from params
		const { fromDate, toDate } = req.params;

		const result = await reportService.getAllReports(
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
