const stockService = require('../services/stock.service');
const { StockTransactionDTO } = require('../dtos/stock.dto');

// Create Stock Transaction
exports.createTransaction = async (req, res) => {
	try {
		const dto = StockTransactionDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await stockService.createStockTransaction(userPayload, dto);
		res.status(201).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};

// Get All Transactions
exports.getAllTransactions = async (req, res) => {
	try {
		const dto = StockTransactionDTO(req);
		const userPayload = {
			tenant_id: dto.tenant_id,
			organization_id: dto.organization_id,
		};

		const result = await stockService.getAllStockTransactions(userPayload);
		res.status(200).json(result);
	} catch (error) {
		res.status(error.statusCode || 500).json({
			success: false,
			message: error.message || 'Internal Server Error',
		});
	}
};
