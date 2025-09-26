const router = require('express').Router();
const categoryController = require('../controllers/category.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Create Category
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	categoryController.create
);

// Update Category
router.put(
	'/:tenantId/:organizationId/:categoryId/update',
	authenticate,
	verifyTenant,
	categoryController.update
);

// Soft Delete Category
router.delete(
	'/:tenantId/:organizationId/:categoryId/delete',
	authenticate,
	verifyTenant,
	categoryController.delete
);

// Get One Category
router.get(
	'/:tenantId/:organizationId/:categoryId/list',
	authenticate,
	verifyTenant,
	categoryController.getById
);

// Get All Categories
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	categoryController.getAll
);

//public api
// Get All Categories
router.get('/:organizationId/lists', categoryController.getAllGroupby);

module.exports = router;
