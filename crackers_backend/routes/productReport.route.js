const router = require('express').Router();
const productController = require('../controllers/productReport.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// GET Product Report with fromDate/toDate
router.get(
	'/:tenantId/:organizationId/:fromDate/:toDate/lists',
	authenticate,
	verifyTenant,
	productController.getAll
);

module.exports = router;
