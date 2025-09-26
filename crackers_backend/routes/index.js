const router = require('express').Router();

router.use('/organizations', require('./organization.route'));
router.use('/invitations', require('./invitation.route'));
router.use('/tenantusers', require('./tenantUser.route'));
router.use('/customers', require('./customer.route'));
router.use('/categories', require('./category.route'));
router.use('/products', require('./product.route'));
router.use('/stocks', require('./stock.route'));
router.use('/stores', require('./store.route'));
router.use('/payments', require('./payment.route'));
router.use('/estimates', require('./estimate.route'));
router.use('/sales', require('./sales.route'));
router.use('/quotations', require('./quotation.routes'));

module.exports = router;
