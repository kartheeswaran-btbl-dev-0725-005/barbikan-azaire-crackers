const router = require('express').Router();
const customerController = require('../controllers/customerReport.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// GET Customer Report with fromDate/toDate
router.get(
	'/:tenantId/:organizationId/:fromDate/:toDate/lists',
	authenticate,
	verifyTenant,
	customerController.getAll
);

module.exports = router;
