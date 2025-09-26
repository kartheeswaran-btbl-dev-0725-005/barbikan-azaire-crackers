const router = require('express').Router();
const controller = require('../controllers/quotation.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Create Quotation
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	controller.create
);

// Update Quotation
router.put(
	'/:tenantId/:organizationId/:quotationId/update',
	authenticate,
	verifyTenant,
	controller.update
);

// Soft Delete Quotation
router.delete(
	'/:tenantId/:organizationId/:quotationId/delete',
	authenticate,
	verifyTenant,
	controller.delete
);

// Get One Quotation (with items)
router.get(
	'/:tenantId/:organizationId/:quotationId/list',
	authenticate,
	verifyTenant,
	controller.getById
);

// Get All Quotations
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	controller.getAll
);

module.exports = router;
