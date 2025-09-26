const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(
	dbConfig.DB.NAME,
	dbConfig.DB.USER,
	dbConfig.DB.PASSWORD,
	{
		host: dbConfig.DB.HOST,
		dialect: dbConfig.DB.DIALECT,
		logging: false, // 🚀 disables all SQL logs
	}
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Organization = require('./organization.model')(
	sequelize,
	Sequelize.DataTypes
);
// Complete Models
db.TenantUser = require('./tenantUser.model')(sequelize, Sequelize.DataTypes);
db.Invitation = require('./invitation.model')(sequelize, Sequelize.DataTypes);
db.Customer = require('./customer.model')(sequelize, Sequelize.DataTypes);
db.Category = require('./category.model')(sequelize, Sequelize.DataTypes);
db.Product = require('./product.model')(sequelize, Sequelize.DataTypes);
db.GroupBy = require('./GroupBy.model')(sequelize, Sequelize.DataTypes);
db.StockLog = require('./stockLog.model')(sequelize, Sequelize.DataTypes);
db.Payment = require('./payment.model')(sequelize, Sequelize.DataTypes);
db.Store = require('./store.model')(sequelize, Sequelize.DataTypes);
db.Estimate = require('./estimate.model')(sequelize, Sequelize.DataTypes);
// prettier-ignore
db.EstimateItem = require('./estimateItem.model')(sequelize, Sequelize.DataTypes);
db.Sales = require('./sales.model')(sequelize, Sequelize.DataTypes);
db.Quotation = require('./quotation.model')(sequelize, Sequelize.DataTypes);
// prettier-ignore
db.QuotationItem = require('./quotationItem.model')(sequelize, Sequelize.DataTypes);

// Incomplete models
db.UserLog = require('./userLog.model')(sequelize, Sequelize.DataTypes);

Object.values(db).forEach((model) => {
	if (model.associate) model.associate(db);
});

module.exports = db;
