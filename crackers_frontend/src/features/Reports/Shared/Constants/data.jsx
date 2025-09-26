import { LuIndianRupee } from "react-icons/lu";
import { CiStar } from "react-icons/ci";
import {
  FiShoppingCart,
  FiUsers,
  FiBox,
  FiAlertCircle,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

const customerreportstats = [
  {
    title: "Total Customers",
    value: "3",
    message: "active customers",
    change: "+8.2%",
    trend: "up",
    icon: FiUsers,
  },
  {
    title: "Total Revenue",
    value: "₹140,000",
    message: "From customer orders",
    change: "-3.1%",
    trend: "down",
    icon: LuIndianRupee,
  },
  {
    title: "Avg Order Value",
    value: "₹3182",
    message: "Per customer order",
    change: "+5.4%",
    trend: "up",
    icon: FiShoppingCart,
  },
  {
    title: "Retention Rate",
    value: "85.4%",
    message: "Customer retention",
    change: "-1.7%",
    trend: "down",
    icon: FiTrendingUp,
  },
];
const inventoryreportdata = [
    {
        title: 'Total Stock Value',
        value: '₹40,500',
        message: 'Current inventory value',
        change: '+4.8%',
        trend: 'up',
        icon: LuIndianRupee,
    },
    {
        title: 'Total Units',
        value: '260',
        message: 'Units in stock',
        change: '-2.5%',
        trend: 'down',
        icon: FiBox,
    },
    {
        title: 'Reorder Alerts',
        value: '1',
        message: 'Items need reordering',
        change: '+1.0%',
        trend: 'down',
        icon: FiAlertCircle,
    },
    {
        title: 'Stock Turnover',
        value: '4.2x',
        message: 'Annual turnover rate',
        change: '+3.6%',
        trend: 'up',
        icon: FiTrendingUp,
    },
];

const salesreportstats = [
  {
    title: "Total Sales",
    value: "₹2,45,890",
    message: "+12.5% from last month",
    change: "+12.5%",
    trend: "up",
    icon: LuIndianRupee,
  },
  {
    title: "Total Orders",
    value: "186",
    message: "+8.2% from last month",
    change: "+8.2%",
    trend: "up",
    icon: FiShoppingCart,
  },
  {
    title: "Avg Order Value",
    value: "₹3182",
    message: "+4.1% from last month",
    change: "+4.1%",
    trend: "up",
    icon: FiTrendingUp,
  },
  {
    title: "Conversion Rate",
    value: "5.4%",
    message: "+0.8% from last month",
    change: "+0.8%",
    trend: "up",
    icon: CiStar,
  },
];

const productreportstats = [
  {
    title: "Total Products",
    value: "5",
    message: "Across 3 categories",
    change: "+2.4%",
    trend: "up",
    icon: FiBox,
  },
  {
    title: "Inventory Value",
    value: "₹140,000",
    message: "Total stock value",
    change: "-1.9%",
    trend: "down",
    icon: LuIndianRupee,
  },
  {
    title: "Low Stock Items",
    value: "1",
    message: "Need reordering",
    change: "+0.5%",
    trend: "down",
    icon: FiAlertCircle,
  },
  {
    title: "Out of Stock",
    value: "0",
    message: "Urgent attention",
    change: "-0.3%",
    trend: "down",
    icon: FiTrendingDown,
  },
];

const sampleTopProducts = {
    recentOrders: [
        {
            type: "Sparklers",
            product: "Golden Sparklers",
            amount: "₹36,750",
            units: "245"
        }, {
            type: "Bomb",
            product: "Premium Bomb",
            amount: "₹3,750",
            units: "15"
        }

    ]
};

const sampleCategoryDistribution = [
    { product: "Sparklers", count: 0.25 },
    { product: "Bombs", count: 0.5 }
];


const sampleStockData = [
    { name: "High Stock", value: 50, color: "#0088fe" },
    { name: "Low Stock", value: 50, color: "#00c49f" },
];

const samplePriceRange = [
        { price: "Sparklers", count: 1 }
    ] 
const sampleStockMovementData = [
    { month: "Jan", outStockValue: 800, inStockValue: 1200 },
    { month: "Feb", outStockValue: 950, inStockValue: 1400 },
    { month: "Mar", outStockValue: 1200, inStockValue: 1100 },
    { month: "Apr", outStockValue: 1050, inStockValue: 1600 },
    { month: "May", outStockValue: 1100, inStockValue: 1300 },
    { month: "Jun", outStockValue: 1250, inStockValue: 1500 }
];

const sampleMetricsData = [
    { label: "Sparklers", units: 245, percentage: 94.2 },
    { label: "Bombs", units: 15, percentage: 5.8, value: 1, total: 3 },
    { label: "Flower Pots", units: 0, percentage: 0.0, value: 2, total: 3 },
];
const sampleStockvaluedistribution = [
    { name: "Sparklers", value: 35750, color: "#0088fe" },
    { name: "Bombs", value: 3750, color: "#00c49f" },
    { name: "Flower Pots", value: 1, color: "#b7c400ff" }
];

const sampleInventoryPerformanceMetrics = [
    { label: "Stock Coverage", percentage: 78.4 },
    { label: "Inventory Accuracy", percentage: 92.1 },
    { label: "Order Fulfillment Rate", percentage: 89.6 },
    { label: "Dead Stock Percentage", percentage: 3.2 },
];

const userData = [
  {
    heading: "Amit Shah",
    tagline: "22 orders",
    amount: "₹67,000",
  },
  {
    heading: "Rahul Kumar",
    tagline: "15 orders",
    amount: "₹45,000",
  },
  {
    heading: "Priya Sharma",
    tagline: "8 orders",
    amount: "₹28,000",
  },
];

const metricsData = [
  { label: "Active Customers", value: 3, total: 3 },
  { label: "High-Value Customers (₹50k+)", value: 1, total: 3 },
  { label: "Regular Customers (10+ orders)", value: 2, total: 3 },
];

export {
    customerreportstats,
    inventoryreportdata,
    salesreportstats,
    productreportstats,
    sampleTopProducts,
    sampleCategoryDistribution,
    sampleStockData,
    samplePriceRange,
    sampleStockMovementData,
    sampleMetricsData,
    sampleStockvaluedistribution,
    sampleInventoryPerformanceMetrics,
    userData,
    metricsData,
};
