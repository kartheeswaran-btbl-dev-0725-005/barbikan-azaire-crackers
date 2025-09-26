const router = require('express').Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// ✅ GET with params
router.get(
	'/:tenantId/:organizationId/:fromDate/:toDate/lists',
	authenticate,
	verifyTenant,
	analyticsController.getAll
);

module.exports = router;
