const { Order, Enquiry, Invoice, Product, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.getDashboardData = async () => {
  const [
    totalOrders,
    onlineEnquiries,
    invoiceCreated,
    totalSales,
    monthlySales,
    topSellingProducts,
    recentOnlineEnquiries,
    lowStockProducts
  ] = await Promise.all([
    Order.count(),
    Enquiry.count(),
    Invoice.count(),
    Order.sum('totalAmount'),
    getMonthlyRevenueChart(),
    getTopSellingProducts(),
    Enquiry.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'customerName', 'mobile', 'productName', 'createdAt']
    }),
    Product.findAll({
      where: {
        stock: { [Op.lte]: 10 }
      },
      attributes: ['id', 'name', 'stock']
    })
  ]);

  return {
    cards: {
      totalOrders,
      onlineEnquiries,
      invoiceCreated,
      totalSales
    },
    monthlyRevenue: monthlySales,
    topSellingProducts,
    recentOnlineEnquiries,
    lowStockProducts
  };
};

const getMonthShortName = (monthNumber) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNumber - 1];
};

const getMonthlyRevenueChart = async () => {
  const sales = await Order.findAll({
    attributes: [
      [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
      [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'total']
    ],
    group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
    order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']]
  });

  return sales.map(item => ({
    month: getMonthShortName(item.dataValues.month),
    total: parseFloat(item.dataValues.total)
  }));
};


const getTopSellingProducts = async () => {
  const allProducts = await Order.findAll({
    attributes: [
      'productName',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'qty']
    ],
    group: ['productName'],
    order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']]
  });

  const totalQty = allProducts.reduce((sum, p) => sum + parseInt(p.dataValues.qty), 0);

  const top5 = allProducts.slice(0, 5).map(p => ({
    name: p.dataValues.productName,
    percentage: ((p.dataValues.qty / totalQty) * 100).toFixed(2)
  }));

  const othersQty = allProducts.slice(5).reduce((sum, p) => sum + parseInt(p.dataValues.qty), 0);
  if (othersQty > 0) {
    top5.push({
      name: 'Others',
      percentage: ((othersQty / totalQty) * 100).toFixed(2)
    });
  }

  return top5;
};
