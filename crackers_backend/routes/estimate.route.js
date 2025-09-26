const router = require('express').Router();
const estimateController = require('../controllers/estimate.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Create Estimate
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	estimateController.create
);

// Update Estimate
router.put(
	'/:tenantId/:organizationId/:estimateId/update',
	authenticate,
	verifyTenant,
	estimateController.update
);

// Soft Delete Estimate
router.delete(
	'/:tenantId/:organizationId/:estimateId/delete',
	authenticate,
	verifyTenant,
	estimateController.delete
);

// Get One Estimate
router.get(
	'/:tenantId/:organizationId/:estimateId/list',
	authenticate,
	verifyTenant,
	estimateController.getById
);

// Get All Estimates
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	estimateController.getAll
);

// Public API
// Create Estimate
router.post('/:organizationId/add', estimateController.createPublic);

module.exports = router;
