const { Customer, Product } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.count();
    const totalProducts = await Product.count();

    // Placeholder values for cards
    const totalOrders = 0;
    const totalEnquiries = 0;
    const invoicesCreated = 0;
    const totalSales = 0;

    // Monthly Revenue (Bar Chart)
    const monthlyRevenue = [];

    // Top Selling Products (Pie Chart Format)
    const topProducts = [];

    // Recent Online Enquiries (Placeholder)
    const recentEnquiries = [];

    // Low Stock Products
    const lowStockList = await Product.findAll({
      where: {
        openingStock: { [Op.lte]: 10 },
      },
      attributes: ['id', 'name', 'openingStock']
    });

    res.json({
      cards: {
        totalOrders,
        totalEnquiries,
        invoicesCreated,
        totalSales
      },
      monthlyRevenue,
      topProducts,
      recentEnquiries,
      lowStockList
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};