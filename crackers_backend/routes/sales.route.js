const router = require('express').Router();
const salesController = require('../controllers/sales.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Get All Sales
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	salesController.getAll
);

module.exports = router;
