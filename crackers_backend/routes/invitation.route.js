const router = require('express').Router();
const controller = require('../controllers/invitation.controller');

// Auth Middlewares
const { authenticate } = require('../middlewares/auth.middleware'); // JWT Authentication
const { verifyTenant } = require('../middlewares/verifyTenant.middleware');

// Send New Invitations
router.post(
	'/:tenantId/:organizationId/invite',
	authenticate,
	verifyTenant,
	controller.invite
);

module.exports = router;
