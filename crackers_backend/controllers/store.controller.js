const storeService = require('../services/store.service');
const { StoreDTO } = require('../dtos/store.dto');

// Create Store
exports.create = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await storeService.createStore(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Update Store
exports.update = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await storeService.updateStore(dto, userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Soft Delete Store
exports.delete = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await storeService.deleteStore(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get One Store
exports.getById = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await storeService.getStoreById(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Stores
exports.getAll = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await storeService.getAllStores(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Public APIs
// Get One Store
exports.getByIdPublic = async (req, res) => {
	try {
		const dto = StoreDTO(req);
		const userPayload = {
			organization_id: dto.organization_id,
		};

		const result = await storeService.getStoreByIdPublic(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
