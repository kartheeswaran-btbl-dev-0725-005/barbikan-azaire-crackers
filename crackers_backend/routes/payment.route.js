// routes/payment.route.js
const router = require('express').Router();
const paymentController = require('../controllers/payment.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// File Upload Middleware (Multer)
const upload = require('../middlewares/upload.middleware'); // for QR code

// Create Payment Method
router.post(
	'/:tenantId/:organizationId/add',
	authenticate,
	verifyTenant,
	upload.single('qrCode'), // UPI QR code upload (optional for Bank)
	paymentController.create
);

// Update Payment Method
router.put(
	'/:tenantId/:organizationId/:paymentId/update',
	authenticate,
	verifyTenant,
	upload.single('qrCode'), // UPI QR code upload
	paymentController.update
);

// Soft Delete Payment Method
router.delete(
	'/:tenantId/:organizationId/:paymentId/delete',
	authenticate,
	verifyTenant,
	paymentController.delete
);

// Get One Payment Method
router.get(
	'/:tenantId/:organizationId/:paymentId/list',
	authenticate,
	verifyTenant,
	paymentController.getById
);

// Get All Payment Methods
router.get(
	'/:tenantId/:organizationId/lists',
	authenticate,
	verifyTenant,
	paymentController.getAll
);

// Public Route
// Get All Payment Methods
router.get('/:organizationId/lists', paymentController.getAllPublic);

module.exports = router;
