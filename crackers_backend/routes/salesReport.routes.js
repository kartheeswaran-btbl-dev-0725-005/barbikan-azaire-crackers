const router = require('express').Router();
const reportController = require('../controllers/salesReport.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// GET Reports Summary with date range (params only)
router.get(
	'/:tenantId/:organizationId/:fromDate/:toDate/lists',
	authenticate,
	verifyTenant,
	reportController.getAll
);

module.exports = router;
