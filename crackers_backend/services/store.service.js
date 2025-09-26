const { Store } = require('../models');
const {
	createStoreSchema,
	updateStoreSchema,
} = require('../validations/store.validation');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const createError = require('../utils/error.util');
const { checkPermission } = require('../utils/permission.util');
const { generateStoreId } = require('../utils/idGenerator.util');

// Create Store
exports.createStore = async (tenantUserPayload, payload) => {
	// Permission check
	await checkPermission(tenantUserPayload, 'store');

	// Validate input
	const { error } = createStoreSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 409);

	// 🔍 Check if store already exists for tenant + organization
	const existingStore = await Store.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});
	if (existingStore) {
		throw createError(
			'Store already exists for this tenant and organization',
			400
		);
	}

	// Generate store_id
	const storeId = await generateStoreId();

	// Insert record
	const store = await Store.create({
		store_id: storeId,
		tenant_id: tenantUserPayload.tenant_id,
		organization_id: tenantUserPayload.organization_id,
		name: payload.name,
		description: payload.description || null,
		min_order_value: payload.min_order_value || 0,
		online_orders_enabled: payload.online_orders_enabled ?? false,
		store_logo: payload.store_logo || null,
		shipping_charges: payload.shipping_charges ?? 0,
		courier_charges: payload.courier_charges ?? 0,
		phone: payload.phone || null,
		email: payload.email || null,
		address_line1: payload.address_line1 || null,
		address_line2: payload.address_line2 || null,
		city: payload.city || null,
		state: payload.state || null,
		postal_code: payload.postal_code || null,
		country: payload.country || null,
		status: payload.status || 'active',
	});

	return {
		success: true,
		message: 'Store created successfully',
		data: {
			store_id: store.store_id,
			name: store.name,
			description: store.description,
			min_order_value: store.min_order_value,
			online_orders_enabled: store.online_orders_enabled,
			store_logo: store.store_logo,
			shipping_charges: store.shipping_charges,
			courier_charges: store.courier_charges,
			phone: store.phone,
			email: store.email,
			address_line1: store.address_line1,
			address_line2: store.address_line2,
			city: store.city,
			state: store.state,
			postal_code: store.postal_code,
			country: store.country,
			status: store.status,
		},
	};
};

// Update Store
exports.updateStore = async (payload, tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'store');

	const { value, error } = updateStoreSchema.validate(payload);
	if (error) throw createError(error.details[0].message, 400);

	// Remove tenant_id and organization_id to prevent update

	const store = await Store.findOne({
		where: { tenant_id: value.tenant_id, organization_id: value.organization_id },
	});
	if (!store) throw createError('Store not found', 404);

	// Update the store with all provided fields
	await store.update(value); // ✅ works now because DTO already prepares new fields

	// Response data
	const responseData = {
		store_id: store.store_id,
		tenant_id: store.tenant_id,
		organization_id: store.organization_id,
		name: store.name,
		description: store.description,
		min_order_value: store.min_order_value,
		online_orders_enabled: store.online_orders_enabled,
		store_logo: store.store_logo, // ✅ added
		shipping_charges: store.shipping_charges, // ✅ added
		courier_charges: store.courier_charges, // ✅ added
		phone: store.phone, // ✅ added
		email: store.email, // ✅ added
		address_line1: store.address_line1, // ✅ added
		address_line2: store.address_line2, // ✅ added
		city: store.city, // ✅ added
		state: store.state, // ✅ added
		postal_code: store.postal_code, // ✅ added
		country: store.country, // ✅ added
		status: store.status,
	};

	return {
		success: true,
		message: 'Store updated successfully',
		data: responseData,
	};
};

// Soft Delete Store
exports.deleteStore = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'store');

	const store = await Store.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});
	if (!store) throw createError('Store not found', 404);

	await store.update({ status: 'deleted' });
	await store.destroy();

	return {
		success: true,
		message: 'Store deleted successfully',
	};
};

// Get One Store
exports.getStoreById = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'store');

	const store = await Store.findOne({
		where: {
			tenant_id: tenantUserPayload.tenant_id,
			organization_id: tenantUserPayload.organization_id,
		},
	});

	if (!store) throw createError('Store not found', 404);

	const responseData = {
		store_id: store.store_id,
		tenant_id: store.tenant_id,
		organization_id: store.organization_id,
		name: store.name,
		description: store.description,
		min_order_value: store.min_order_value,
		online_orders_enabled: store.online_orders_enabled,
		status: store.status,
	};

	return {
		success: true,
		message: 'Store fetched successfully',
		data: formatDatesTime(responseData, { includeDeletedAt: true }),
	};
};

// Get All Stores for tenant/org
exports.getAllStores = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'store');

	const { tenant_id, organization_id } = tenantUserPayload;

	const stores = await Store.findAll({
		where: { tenant_id, organization_id },
		order: [['createdAt', 'ASC']],
		paranoid: true,
	});

	if (!stores.length) {
		// ❌ Throw 404 so frontend can handle creation
		throw createError('No stores found for this tenant and organization', 404);
	}

	return {
		success: true,
		message: 'Stores fetched successfully',
		data: formatDatesTime(stores, { includeDeletedAt: true }),
	};
};

// Public APIs
// Get One Store
exports.getStoreByIdPublic = async ({ organization_id }) => {
	const store = await Store.findOne({
		where: { organization_id: organization_id },
	});
	if (!store) throw createError('Store not found', 404);

	// Pick only required fields for public response
	const responseData = {
		store_id: store.store_id,
		tenant_id: store.tenant_id,
		organization_id: store.organization_id,

		// General Info
		name: store.name,
		description: store.description,
		min_order_value: store.min_order_value,
		online_orders_enabled: store.online_orders_enabled,
		store_logo: store.store_logo, // ✅ added

		// Lifecycle
		status: store.status,

		// Charges
		courier_charges: store.courier_charges, // ✅ added
		shipping_charges: store.shipping_charges, // ✅ added

		// Contact Info
		phone: store.phone, // ✅ added
		email: store.email, // ✅ added

		// Address Info
		address_line1: store.address_line1, // ✅ added
		address_line2: store.address_line2, // ✅ added
		city: store.city, // ✅ added
		state: store.state, // ✅ added
		postal_code: store.postal_code, // ✅ added
		country: store.country, // ✅ added
		createdAt: store.createdAt,
		updatedAt: store.updatedAt,
	};

	return {
		success: true,
		message: 'Store fetched successfully',
		data: formatDatesTime(responseData),
	};
};
