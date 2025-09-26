const analyticsService = require('../services/analytics.service');

exports.getAll = async (req, res) => {
	try {
		const tenantPayload = {
			tenant_id: req.params.tenantId,
			organization_id: req.params.organizationId,
		};

		// ✅ Now read from URL params
		const { fromDate, toDate } = req.params;

		if (!fromDate || !toDate) {
			return res.status(400).json({
				success: false,
				message: 'fromDate and toDate are required in params',
			});
		}

		const result = await analyticsService.getSummary(
			tenantPayload,
			fromDate,
			toDate
		);

		res.status(200).json(result);
	} catch (error) {
		console.error('Analytics Error:', error);
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
