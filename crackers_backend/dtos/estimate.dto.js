const { EstimateItemDTO } = require('./estimateItem.dto');

exports.EstimateDTO = (req) => ({
	organization_id: req.params?.organizationId || null,
	customer_name: req.body?.name?.trim() || '',
	phone: req.body?.phone?.trim() || null,
	email: req.body?.email?.trim() || null,
	address: req.body?.address?.trim() || null,
	state: req.body?.state?.trim() || null,
	city: req.body?.city?.trim() || null,
	postal_code: req.body?.postalCode?.trim() || null,
	message: req.body?.message?.trim() || null,
	priority: req.body?.priority || 'medium',
	status: req.body?.status || 'pending',
	notes: req.body?.notes?.trim() || null,
	total_price: req.body?.totalPrice || 0,
	discount: req.body?.discount || 0,
	total_amount: req.body?.totalAmount || 0,
	product_items:
		req.body?.productItems?.map((item) => EstimateItemDTO(item)) || [],
});
