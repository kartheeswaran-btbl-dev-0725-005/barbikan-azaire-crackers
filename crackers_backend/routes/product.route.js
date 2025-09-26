const router = require('express').Router();
const productController = require('../controllers/product.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Fiels Middlewares
const upload = require('../middlewares/upload.middleware'); // your multer middleware

// Create Product
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	upload.array('images', 4), // field name: "images", max 5 files
	productController.create
);

// Update Product
router.put(
	'/:tenantId/:organizationId/:productId/update',
	authenticate,
	verifyTenant,
	upload.array('images', 4), // field name: "images", max 5 files
	productController.update
);

// 👉 Soft Delete Product
router.delete(
	'/:tenantId/:organizationId/:productId/delete',
	authenticate,
	verifyTenant,
	productController.delete
);

// 👉 Get One Product
router.get(
	'/:tenantId/:organizationId/:productId/list',
	authenticate,
	verifyTenant,
	productController.getById
);

// 👉 Get All Products
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	productController.getAll
);

// 👉 Get All Products with groupby
router.get('/:organizationId/lists', productController.getAllGroupBy);

module.exports = router;
