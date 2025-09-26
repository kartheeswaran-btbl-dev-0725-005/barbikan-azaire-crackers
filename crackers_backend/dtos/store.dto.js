exports.StoreDTO = (req) => {
	return {
		tenant_id: req.params?.tenantId || null,
		organization_id: req.params?.organizationId || null,

		// General Info
		name: req.body?.name?.trim() || '',
		description: req.body?.description?.trim() || null,
		min_order_value: req.body?.minOrderValue ?? 0,
		online_orders_enabled: req.body?.onlineOrdersEnabled ?? false,
		store_logo: req.file ? req.file.filename : null, // ✅ fixed for single upload

		// Lifecycle
		status: req.body?.status || 'active',

		// Feature Scalable Fields
		courier_charges: req.body?.courierCharges ?? 0,
		shipping_charges: req.body?.shippingCharges ?? 0,

		// Contact Info
		phone: req.body?.phone || null,
		email: req.body?.email || null,

		// Address Info
		address_line1: req.body?.addressLine1 || null,
		address_line2: req.body?.addressLine2 || null,
		city: req.body?.city || null,
		state: req.body?.state || null,
		postal_code: req.body?.postalCode || null,
		country: req.body?.country || null,

		/*
		// Flexible Configurations
		appearance: req.body?.appearance || null,
		notifications: req.body?.notifications || null,
		*/
	};
};
