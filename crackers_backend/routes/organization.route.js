const router = require('express').Router();
const controller = require('../controllers/organization.controller');

// Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Create Organization
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	controller.create
);

// Get One Organization under a Tenant
router.get(
	'/:tenantId/:organizationId/list',
	authenticate,
	verifyTenant,
	controller.getOne
);

// Get All Organizations under a Tenant
router.get('/:tenantId/lists', authenticate, verifyTenant, controller.getAll);

module.exports = router;
