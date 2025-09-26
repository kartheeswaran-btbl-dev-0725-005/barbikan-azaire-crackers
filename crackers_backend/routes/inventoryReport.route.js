const router = require('express').Router();
const inventoryController = require('../controllers/inventoryReport.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// GET Inventory Report
router.get(
	'/:tenantId/:organizationId/:fromDate/:toDate/lists',
	authenticate,
	verifyTenant,
	inventoryController.getAll
);

module.exports = router;
