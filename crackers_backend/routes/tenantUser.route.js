const router = require('express').Router();
const controller = require('../controllers/tenantUser.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Update tenant user
router.put(
	'/:tenantId/:organizationId/:userId/update',
	authenticate,
	verifyTenant,
	controller.updateTenantUser
);

// Getall tenant user
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	controller.getAll
);
module.exports = router;
