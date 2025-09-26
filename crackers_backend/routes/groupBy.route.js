const router = require('express').Router();
const groupByController = require('../controllers/groupBy.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Create GroupBy
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	groupByController.create
);

// Update GroupBy
router.put(
	'/:tenantId/:organizationId/:id/update',
	authenticate,
	verifyTenant,
	groupByController.update
);

// Soft Delete GroupBy
router.delete(
	'/:tenantId/:organizationId/:id/delete',
	authenticate,
	verifyTenant,
	groupByController.delete
);

// Get One GroupBy
router.get(
	'/:tenantId/:organizationId/:id/list',
	authenticate,
	verifyTenant,
	groupByController.getById
);

// Get All GroupBy
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	groupByController.getAll
);

// Public API - Get All GroupBy (by organization only)
router.get('/:organizationId/lists', groupByController.getAll);

module.exports = router;
