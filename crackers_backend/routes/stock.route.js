const router = require('express').Router();
const stockController = require('../controllers/stock.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Add Stock Transaction
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	stockController.createTransaction
);

// Get All Stock Transactions
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	stockController.getAllTransactions
);

module.exports = router;
