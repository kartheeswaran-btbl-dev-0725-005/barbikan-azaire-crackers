const router = require('express').Router();
const customerController = require('../controllers/customer.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// 1. Create Customer
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	customerController.create
);

// 2. Update Customer
router.put(
	'/:tenantId/:organizationId/:customerId/update',
	authenticate,
	verifyTenant,
	customerController.update
);

// 3. Delete Customer
router.delete(
	'/:tenantId/:organizationId/:customerId/delete',
	authenticate,
	verifyTenant,
	customerController.delete
);

// 4. Get Specific Customer
router.get(
	'/:tenantId/:organizationId/:customerId/list',
	authenticate,
	verifyTenant,
	customerController.getOne
);

// 5. Get All Customers
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	customerController.getAll
);

module.exports = router;
