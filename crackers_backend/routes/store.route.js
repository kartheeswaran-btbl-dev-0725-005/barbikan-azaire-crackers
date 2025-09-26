const router = require('express').Router();
const storeController = require('../controllers/store.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Files Middlewares
const upload = require('../middlewares/upload.middleware'); // your multer middleware

// Create Store
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	upload.single('storeLogo'),
	storeController.create
);

// Update Store
router.put(
	'/:tenantId/:organizationId/:storeId/update',
	authenticate,
	verifyTenant,
	upload.single('storeLogo'),
	storeController.update
);

// Soft Delete Store
router.delete(
	'/:tenantId/:organizationId/:storeId/delete',
	authenticate,
	verifyTenant,
	storeController.delete
);

// Get One Store
router.get(
	'/:tenantId/:organizationId/:storeId/list',
	authenticate,
	verifyTenant,
	storeController.getById
);

// Get All Stores
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	storeController.getAll
);

// Public Route
// Get One Store
router.get('/:organizationId/list', storeController.getByIdPublic);
module.exports = router;
