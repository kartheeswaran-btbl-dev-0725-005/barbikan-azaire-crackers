const createError = require('http-errors');

exports.verifyTenant = (req, res, next) => {
	try {
		// Check if user is attached by your auth middleware
		if (!req.user) {
			throw createError(401, 'Authentication required');
		}

		const loggedInTenantId = req.user.tenant_id;
		const paramTenantId = req.params.tenantId;

		// Tenant ID mismatch
		if (loggedInTenantId !== paramTenantId) {
			throw createError(403, 'Unauthorized: Tenant mismatch');
		}

		// Pass control to next middleware/controller
		next();
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Tenant authentication failed',
		});
	}
};
