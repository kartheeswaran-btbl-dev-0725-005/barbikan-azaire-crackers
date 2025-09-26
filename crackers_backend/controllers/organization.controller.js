const organizationService = require('../services/organization.service');

exports.create = async (req, res) => {
	try {
		const { tenantId, organizationId } = req.params;
		const result = await organizationService.createOrganization({
			tenantId,
			organizationId,
		});

		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

exports.getOne = async (req, res) => {
	try {
		const { tenantId, organizationId } = req.params;
		const result = await organizationService.getOrganizationById(
			tenantId,
			organizationId
		);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

exports.getAll = async (req, res) => {
	try {
		const { tenantId } = req.params;
		const result = await organizationService.getOrganizations(tenantId);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
