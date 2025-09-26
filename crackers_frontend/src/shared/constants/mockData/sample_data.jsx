import { MdOutlineInventory2 } from "react-icons/md";
import {
    HiOutlineDocumentCurrencyRupee,
    HiOutlineDocumentChartBar
} from "react-icons/hi2";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { LiaUsersCogSolid } from "react-icons/lia";
import { LuIndianRupee } from "react-icons/lu";
import {
    FiShoppingCart,
    FiUser,
    FiPhone,
    FiMail,
    FiUsers,
    FiFileText,
    FiHelpCircle,
    FiCalendar,
    FiBox,
    FiTag,
} from "react-icons/fi";
import { AiOutlineBarChart, AiOutlineRise, AiOutlineFall } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";


const faqData = [
    {
        id: 1,
        question: "How do I add new products to my inventory?",
        answer: 'Navigate to Product Management, click on "Add Product", fill in the product details including name, category, price, and stock quantity, then save.'
    },
    {
        id: 2,
        question: "How can I generate sales reports?",
        answer: 'Go to Reports section, select the type of report you want (Sales, Customer, Product), choose your date range, and click "Generate Report".'
    },
    {
        id: 3,
        question: "How do I manage customer information?",
        answer: "In Customer Management, you can view all customers, add new customers, edit existing customer details, and track their purchase history."
    },
    {
        id: 4,
        question: "How to create quotations for customers?",
        answer: "Use the Quotation section to create price quotes. Enter customer details, add products with quantities, and the system will calculate totals automatically. "
    },
    {
        id: 5,
        question: "How do I track stock levels?",
        answer: "Stock Management section shows real-time inventory levels, low stock alerts, and allows you to add stock in/out transactions."
    },
    {
        id: 6,
        question: "How to handle online enquiries?",
        answer: "Online Estimate section displays all enquiries from your website. You can view details, update status, and convert enquiries to sales."
    }

];

const guides = [
    {
        "title": "Getting Started Guide",
        "description": "Learn the basics of using Azaire POS system",
        "topics": [
            "Initial Setup",
            "Adding Products",
            "Creating Your First Sale"
        ],
        "buttonText": "Read Guide"
    },
    {
        "title": "Product Management",
        "description": "Complete guide to managing your product catalog",
        "topics": [
            "Categories Setup",
            "Product Details",
            "Stock Management",
            "Pricing Strategies"
        ],
        "buttonText": "Read Guide"
    },
    {
        "title": "Customer Management",
        "description": "Build and maintain your customer database",
        "topics": [
            "Adding Customers",
            "Customer History",
            "Loyalty Programs"
        ],
        "buttonText": "Read Guide"
    },
    {
        "title": "Reports & Analytics",
        "description": "Understand your business performance",
        "topics": [
            "Sales Reports",
            "Customer Analytics",
            "Inventory Reports",
            "Export Options"
        ],
        "buttonText": "Read Guide"
    }
]


const menu_sub_category = [
    {
        label: "Analytics",
        icon: <AiOutlineBarChart size={15} />
    },
    {
        label: "Customer Management",
        icon: <FiUsers size={15} />
    },
    {
        label: "Product Management",
        icon: <FiBox size={15} />
    },
    {
        label: "Stock Management",
        icon: <MdOutlineInventory2 size={15} />
    },
    // {
    //     label: "Quotation",
    //     icon: <HiOutlineDocumentCurrencyRupee size={15} />
    // },
    // {
    //     label: "Sales",
    //     icon: <FiShoppingCart size={15} />
    // },
    {
        label: "Online Estimate",
        icon: <HiOutlineGlobeAlt size={15} />
    },
    {
        label: "Reports",
        icon: <HiOutlineDocumentChartBar size={15} />
    },
    {
        label: "Store Settings",
        icon: <IoSettingsOutline size={15} />
    },
    {
        label: "User Management",
        icon: <LiaUsersCogSolid size={15} />
    },
    {
        label: "Support / Help",
        icon: <FiHelpCircle size={15} />
    }
];

const summary = [
    {
        title: 'Total Orders',
        value: '1,247',
        change: '+12.3%',
        trend: 'up',
        icon: FiShoppingCart,
    },
    {
        title: 'Online Enquiries',
        value: '89',
        change: '+5.1%',
        trend: 'up',
        icon: FiUsers,
    },
    {
        title: 'Invoices Created',
        value: '432',
        change: '-2.4%',
        trend: 'down',
        icon: FiFileText,
    },
    {
        title: 'Total Sales',
        value: '₹2,45,000',
        change: '+18.7%',
        trend: 'up',
        icon: LuIndianRupee,
    },
];

const sampleCustomerStats = [

    {
        title: "Total Customers",
        value: 3,
    },
    {
        title: "Active Customers",
        value: 2,
    },
    {
        title: "New This Month",
        value: 1,
    },
    {
        title: "Avg Order Value",
        value: "₹5,000",
    }
]

const sampleRevenue = {
    monthlyData: [
        { month: "Jan", revenue: 120000 },
        { month: "Feb", revenue: 98000 },
        { month: "Mar", revenue: 135000 },
        { month: "Apr", revenue: 125000 },
        { month: "May", revenue: 150000 },
        { month: "Jun", revenue: 142000 }
    ]
};

const sampleProductData = [
    { name: "Electronics", value: 40, color: "#8884d8" },
    { name: "Clothing", value: 25, color: "#82ca9d" },
    { name: "Home & Kitchen", value: 20, color: "#ffc658" },
    { name: "Sports", value: 10, color: "#ff7f50" },
    { name: "Others", value: 5, color: "#d0ed57" }
];

const sampleRecentOrders = {
    recentOrders: [
        {
            id: "ORD-10234",
            customer: "Amit Sharma",
            amount: "₹3,200",
            status: "Completed",
            time: "2 hours ago"
        },
        {
            id: "ORD-10233",
            customer: "Priya Verma",
            amount: "₹1,050",
            status: "Processing",
            time: "4 hours ago"
        },
        {
            id: "ORD-10231",
            customer: "Meena Iyer",
            amount: "₹540",
            status: "Cancelled",
            time: "2 days ago"
        }
    ]
};

const sampleLowStockData = {
    lowStockItems: [
        { name: "Wireless Mouse", current: 3, minimum: 10 },
        { name: "Laptop Charger", current: 2, minimum: 5 },
        { name: "HDMI Cable", current: 1, minimum: 4 }
    ]
};

const sampleNotifications = [
    {
        id: 1,
        title: "New Order Received",
        message: "You received a new order from John Doe.",
        type: "success",
    },
    {
        id: 2,
        title: "Low Inventory",
        message: "HDMI cables stock is below threshold.",
        type: "warning",
    },
    {
        id: 3,
        title: "Update Available",
        message: "A new version of the dashboard is ready to install.",
        type: "info",
    },
];

const salesData = [
    {
        currentTimePeriod: "Today",
        sales: 5,
        amount: 12500,
        cash: 6000,
        digital: 6500,
        fieldVal: "paymentValue"
    },
    {
        currentTimePeriod: "This Week",
        sales: 28,
        amount: 65000,
        cash: 30000,
        digital: 35000,
        fieldVal: "paymentValue"
    },
    {
        currentTimePeriod: "This Month",
        sales: 145,
        amount: 285000,
        cash: 180000,
        digital: 105000,
        fieldVal: "paymentValue"
    },
    {
        heading: "Cash vs Digital Payments",
        fieldVal: "paymentType",
    }
];

const estimationData = [
    {
        title: "New Enquiries",
        value: 12,
    },
    {
        title: "Contacted",
        value: 8,
    },
    {
        title: "Quoted",
        value: 5,
    },
    {
        title: "Converted",
        value: 3,
    }
];

const sampleUserData = [
    {
        title: "Total Users",
        count: 150,
    },
    {
        title: "Active Users",
        count: 120,
    },
    {
        title: "Admins",
        count: 5,
    }
];

const activeStatus = ["Online", "Offline"];

const sampleCustomers = Array.from({ length: 200 }, (_, i) => {
    const id = `ID: CUS-${i + 1}`;
    const names = [
        "Arun Prakash", "Divya Sharma", "Rahul Verma", "Sneha Iyer", "Karan Malhotra",
        "Priya Singh", "Vikram Rao", "Anjali Kapoor", "Rohan Gupta", "Neha Joshi",
        "Suresh Nair", "Meera Pillai", "Tarun Mehta", "Kavya Reddy", "Amit Chauhan",
        "Ritika Jain", "Manoj Desai", "Pooja Batra", "Raghav Tiwari", "Ishita Banerjee",
        "Ankit Sinha", "Preeti Mishra", "Harish Kumar", "Lavanya D", "Ajay Rathore",
        "Sakshi Goel", "Deepak Bhatt", "Tanvi Shetty", "Nikhil Dube", "Shruti Rao",
        "Abhishek Yadav", "Sana Sheikh", "Rajiv Menon", "Bhavna Nair", "Yash Trivedi",
        "Anusha Narayan", "Gaurav Patil", "Smita Kulkarni", "Ravi Sharma", "Jaya Kapoor",
        "Uday Menon", "Ritika Paul", "Vinay Chaturvedi", "Zoya Khan", "Ramesh Joshi",
        "Madhav Pillai", "Ria Das", "Arnav Kapoor", "Vaibhav Singh", "Tanya Varma"
    ];

    const name = names[i % names.length];
    const email = name ? `${name.split(" ")[0].toLowerCase()}${i + 1}@example.com` : "";
    const phone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const totalOrders = Math.floor(Math.random() * 25);
    const totalPurchaseValue = totalOrders === 0 ? 0 : Math.floor(Math.random() * 50000) + 1000;
    const lastOrder = totalOrders === 0 ? "-" : `2025-07-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`;
    const status = activeStatus[Math.floor(Math.random() * activeStatus.length)];

    return {
        customerInfo: {
            type: 'object',
            value: {
                emoji: <FiUser size={15} />,
                name: {
                    subType: "string",
                    subValue: name
                },
                id: {
                    subType: "string",
                    subValue: id
                }
            },
            customStyle: "flex justify-between items-center px-3 py-3 bg-gray-200 rounded-full"
        },
        contact: {
            type: 'object',
            value: {
                phone: {
                    emoji: <FiPhone />,
                    subType: "string",
                    subValue: phone
                },
                email: {
                    emoji: <FiMail />,
                    subType: "string",
                    subValue: email
                }
            }
        },
        totalOrders: {
            type: 'number',
            value: totalOrders
        },
        totalPurchaseValue: {
            type: 'number',
            value: totalPurchaseValue,
            currency: "₹"
        },
        lastOrder: {
            type: 'string',
            value: lastOrder
        },
        status: {
            type: 'string',
            value: status,
            customStyle: `${status === "Online" ? "bg-green-600" : "bg-red-600"} text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px] text-gray-800`
        },
        actions: {
            type: 'actions',
            value: {
                edit: {
                    subType: null,
                    subValue: null,
                    action: null
                },
                delete: {
                    subType: null,
                    subValue: null,
                    action: null
                }
            }
        }
    };
});

const sampleUsers = Array.from({ length: 5 }, (_, i) => {
    const names = [
        "Aditya Mehta", "Shreya Nair", "Kunal Sharma", "Pallavi Iyer", "Rohit Kapoor"
    ];
    const roles = ["Admin", "Store Manager"];

    const name = names[i % names.length];
    const email = `${name.split(" ")[0].toLowerCase()}${i + 1}@example.com`;
    const phone = `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const lastLogin = `2025-08-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const role = roles[i % roles.length];
    const status = activeStatus[Math.floor(Math.random() * activeStatus.length)];

    return {
        customerInfo: {
            type: 'object',
            value: {
                emoji: <FiUser size={15} />,
                name: {
                    subType: "string",
                    subValue: name
                },
                email: {
                    emoji: <FiMail />,
                    subType: "string",
                    subValue: email
                }
            },
            customStyle: "flex justify-between items-center px-3 py-3 bg-gray-200 rounded-full"
        },
        contact: {
            type: 'object',
            value: {
                phone: {
                    emoji: <FiPhone />,
                    subType: "string",
                    subValue: phone
                }
            }
        },
        role: {
            type: 'string',
            value: role
        },
        status: {
            type: 'string',
            value: status,
            customStyle: `${status === "Online" ?
                "bg-green-600" :
                "bg-red-600"} text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]`
        },
        lastLogin: {
            type: 'string',
            value: lastLogin
        },
        actions: {
            type: 'actions',
            value: {
                edit: {
                    subType: null,
                    subValue: null,
                    action: null
                },
                delete: {
                    subType: null,
                    subValue: null,
                    action: null
                }
            }
        }
    };
});


const crackerNames = [
    "100 Wala", "200 Wala", "500 Wala", "1000 Wala", "Flower Pots Small", "Flower Pots Big",
    "Ground Chakras", "Twinkling Stars", "Bijili Crackers", "Hydrogen Bomb", "Rocket Single Shot",
    "Rocket 5 Shot", "Color Matches", "Pencil Crackers", "Fancy Fountain", "Deluxe Atom Bomb",
    "Whistling Rocket", "Butterfly", "Color Fountain", "Seven Shots", "Magic Pop", "Garland Bomb",
    "Color Smoke", "Peacock Crackers", "Zamin Chakkar Deluxe", "Flashlight", "Lava Fountain",
    "Bullet Bomb", "Red Gun", "Laser Bomb"
];

const crackerCategories = {
    "Sound Crackers": ["100 Wala", "200 Wala", "500 Wala", "1000 Wala", "Hydrogen Bomb", "Bullet Bomb", "Deluxe Atom Bomb", "Garland Bomb", "Laser Bomb", "Red Gun"],
    "Sparklers": ["Color Matches", "Pencil Crackers", "Flashlight"],
    "Fountains": ["Flower Pots Small", "Flower Pots Big", "Fancy Fountain", "Lava Fountain", "Color Fountain", "Peacock Crackers"],
    "Spinners": ["Ground Chakras", "Zamin Chakkar Deluxe"],
    "Rockets": ["Rocket Single Shot", "Rocket 5 Shot", "Whistling Rocket", "Seven Shots"],
    "Fancy Items": ["Twinkling Stars", "Butterfly", "Magic Pop", "Color Smoke"]
};

const unitTypes = ["Piece", "Box", "Packet"];

const availabilityStatus = ["Available", "Out of stock"];

const getCategory = (name) => {
    for (const [category, items] of Object.entries(crackerCategories)) {
        if (items.includes(name)) return category;
    }
    return "Miscellaneous";
};

const generateRandomProducts = (count = 5) => {
    const products = [];

    for (let i = 0; i < count; i++) {
        const name = crackerNames[Math.floor(Math.random() * crackerNames.length)];
        const id = `CRK${(i + 1).toString().padStart(3, "0")}`;
        const category = getCategory(name);
        const price = Math.floor(Math.random() * 100) * 5 + 50; // ₹50 to ₹550
        const stock = Math.floor(Math.random() * 200) + 10; // 10 to 209
        const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
        const status = availabilityStatus[Math.floor(Math.random() * availabilityStatus.length)];

        const product = {
            productInfo: {
                type: 'object',
                value: {
                    emoji: <FiBox size={20} />,
                    name: {
                        subType: "string",
                        subValue: name
                    },
                    id: {
                        subType: "string",
                        subValue: id
                    }
                },
                customStyle: "flex justify-between items-center p-2 bg-gray-900 text-gray-100 rounded-md"
            },
            category: {
                type: 'string',
                value: category,
                customStyle: "inline-block px-2 py-1 rounded-lg bg-gray-100 font-semibold text-[11px] text-gray-800",
            },
            price: {
                type: 'number',
                value: price,
                currency: "₹"
            },
            stock: {
                type: 'number',
                value: stock
            },
            unitType: {
                type: 'string',
                value: unitType
            },
            status: {
                type: 'string',
                value: status,
                customStyle: `${status === "Available" ? "bg-green-600" : "bg-red-600"} text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]`,
            },
            actions: {
                type: 'actions',
                value: {
                    edit: {
                        subType: null,
                        subValue: null,
                        action: null
                    },
                    delete: {
                        subType: null,
                        subValue: null,
                        action: null
                    }
                }
            }
        };

        products.push(product);
    }

    return products;
};

const generateStockStatusTableData = () => {
    const products = generateRandomProducts(20); // Generate 20 sample products
    const stockData = [];

    for (const product of products) {
        const productName = product.productInfo.value.name.subValue;
        const categoryName = product.category.value;
        const currentStock = product.stock.value;

        // Derive avg stock thresholds (can be tuned)
        const minStock = Math.floor(Math.random() * 20) + 20;   // Between 20-39
        const maxStock = minStock + Math.floor(Math.random() * 50) + 20; // 20–69 more than min

        // Determine status
        function getStatusValue() {
            if (currentStock < 15) {
                return "Critical";
            } else if (currentStock > 100) {
                return "Good";
            } else {
                return "Low";
            }
        }

        const status = getStatusValue(currentStock);

        // Generate last updated date (within last 40 days)
        const day = String(Math.floor(Math.random() * 38) + 1).padStart(2, '0');
        const lastUpdated = `2025-07-${day}`;

        stockData.push({
            productName: {
                type: 'object',
                value: {
                    emoji: <FiBox size={20} />,
                    name: {
                        subType: "string",
                        subValue: productName
                    }
                },
                customStyle: "flex justify-between items-center text-center text-black-100"
            },
            categoryName: {
                type: 'string',
                value: categoryName
            },
            currentStock: {
                type: 'number',
                value: currentStock
            },
            minStock: {
                type: 'number',
                value: minStock
            },
            maxStock: {
                type: 'number',
                value: maxStock
            },
            status: {
                type: 'string',
                value: status,
                customStyle: `${status === "Good" ? "bg-green-600" : status === "Low" ? "bg-yellow-600" : "bg-red-600"} text-white inline-block px-2 py-1 rounded-lg text-[11px] font-semibold`
            },
            lastUpdated: {
                type: 'string',
                value: lastUpdated
            }
        });
    }

    return stockData;
};

const stockMovementTypes = ["Stock In", "Stock Out"];
const orderTypes = [
    { label: "Purchase Order", prefix: "PO" },
    { label: "Sales", prefix: "INV" }
];

const generateRandomStockMovements = (count = 10) => {
    const products = generateRandomProducts(20);
    const movements = [];

    for (const product of products) {
        const productName = product.productInfo.value.name.subValue;
        const movementType =
            stockMovementTypes[Math.floor(Math.random() * stockMovementTypes.length)];

        const qty = Math.floor(Math.random() * 50) + 1; // 1–50 units

        const order = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        const orderId = `${order.prefix}-${(Math.floor(Math.random() * 999) + 1)
            .toString()
            .padStart(3, "0")}`;

        // Random date/time in last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const dateTime = `${date.toISOString().split("T")[0]} ${date
            .toTimeString()
            .split(" ")[0]}`;

        movements.push({
            productName: {
                type: "object",
                value: {
                    emoji: <FiBox size={20} />,
                    name: {
                        subType: "string",
                        subValue: productName
                    },
                },
                customStyle:
                    "flex justify-between items-center text-black rounded-md"
            },
            movementType: {
                type: "object",
                value: {
                    emoji: movementType === "Stock In" ? <AiOutlineRise size={15} /> : <AiOutlineFall size={15} />,
                    name: {
                        subType: "string",
                        subValue: movementType
                    }
                },
                customStyle: `${movementType === "Stock In" ? "text-green-600" : "text-red-600"} flex py-1 rounded-lg font-semibold text-[11px]`
            },
            quantity: {
                type: "number",
                value: qty
            },
            orderTypeId: {
                type: "string",
                value: `${order.label} #${orderId}`
            },
            dateTime: {
                type: "string",
                value: dateTime
            }
        });
    }

    return movements;
};

const generateLowStockAlertData = (count = 10) => {
    const products = generateRandomProducts(count); // reuse your existing cracker generator
    const alerts = [];

    for (const product of products) {
        const productName = product.productInfo.value.name.subValue;
        const currentStock = product.stock.value;
        const minimumStock = Math.floor(Math.random() * 20) + 10; // min stock between 10–29

        // Status logic
        const status = currentStock < minimumStock
            ? (currentStock < minimumStock / 2 ? "Critical" : "Low Stock")
            : "OK";

        if (status !== "OK") {
            alerts.push({
                productName: {
                    type: 'object',
                    value: {
                        emoji: <FiBox size={20} />,
                        name: {
                            subType: "string",
                            subValue: productName
                        }
                    },
                    customStyle: "flex items-center gap-2"
                },
                currentStock: {
                    type: 'number',
                    value: currentStock
                },
                minimumStock: {
                    type: 'number',
                    value: minimumStock
                },
                status: {
                    type: 'string',
                    value: status,
                    customStyle: `${status === "Critical" ? "bg-red-600" : "bg-yellow-600"} text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]`
                },
                actionNeeded: {
                    type: 'button',
                    value: "Re-order Now",
                    customStyle: "bg-blue-600 text-white px-3 py-1 rounded-lg text-[11px]"
                }
            });
        }
    }

    return alerts;
};

const lowStockAlertTableData = generateLowStockAlertData(20);
const stockMovementTableData = generateRandomStockMovements(15);
const stockStatusTableData = generateStockStatusTableData();
const sampleProducts = generateRandomProducts(20);


const enquiries = [
    {
        "id": 1,
        "customerName": "Suresh Babu",
        "enquiryNo": "ENQ-2025-CRK-001",
        "enquiryDate": "2025-08-12",
        "status": "new",
        "priority": "high",
        "totalAmount": 25000,
        "phone": "+91 9876501234",
        "email": "suresh.babu@example.com",
        "location": "Virudhunagar",
        "followUpDate": "2025-08-15",
        "message": "Bulk order of Diwali crackers for wholesale.",
        "items": [
            { "name": "1000 Wala", "quantity": 10, "price": 1200 },
            { "name": "Flower Pots – Big", "quantity": 20, "price": 250 }
        ]
    },
    {
        "id": 2,
        "customerName": "Lakshmi Traders",
        "enquiryNo": "ENQ-2025-CRK-002",
        "enquiryDate": "2025-08-11",
        "status": "contacted",
        "priority": "medium",
        "totalAmount": 40000,
        "phone": "+91 9123411122",
        "email": "orders@lakshmitraders.com",
        "location": "Madurai",
        "followUpDate": "2025-08-16",
        "message": "Need assorted gift boxes for retail shop.",
        "items": [
            { "name": "Gift Box – Standard", "quantity": 50, "price": 300 },
            { "name": "Ground Chakkars", "quantity": 40, "price": 100 }
        ]
    },
    {
        "id": 3,
        "customerName": "Ravi Fireworks",
        "enquiryNo": "ENQ-2025-CRK-003",
        "enquiryDate": "2025-08-09",
        "status": "quoted",
        "priority": "low",
        "totalAmount": 55000,
        "phone": "+91 9988776644",
        "email": "ravifireworks@example.com",
        "location": "Salem",
        "followUpDate": "2025-08-18",
        "message": "Quotation required for wedding celebration fireworks.",
        "items": [
            { "name": "Sky Shots – 12", "quantity": 5, "price": 1500 },
            { "name": "Colour Matches", "quantity": 100, "price": 50 },
            { "name": "Sparklers – 15cm", "quantity": 200, "price": 5 }
        ]
    },
    {
        "id": 4,
        "customerName": "Anand Enterprises",
        "enquiryNo": "ENQ-2025-CRK-004",
        "enquiryDate": "2025-08-08",
        "status": "converted",
        "priority": "high",
        "totalAmount": 75000,
        "phone": "+91 9345621112",
        "email": "sales@anandentp.com",
        "location": "Coimbatore",
        "followUpDate": "2025-08-10",
        "message": "Order confirmed for corporate Diwali celebrations.",
        "items": [
            { "name": "Sky Shots – 24", "quantity": 10, "price": 2800 },
            { "name": "Gift Box – Premium", "quantity": 30, "price": 1200 },
            { "name": "Flower Pots – Small", "quantity": 50, "price": 120 }
        ]
    },
    {
        "id": 5,
        "customerName": "Mohan Agencies",
        "enquiryNo": "ENQ-2025-CRK-005",
        "enquiryDate": "2025-08-07",
        "status": "converted",
        "priority": "medium",
        "totalAmount": 18000,
        "phone": "+91 9003223344",
        "email": "mohan.agencies@example.com",
        "location": "Tirunelveli",
        "followUpDate": "2025-08-09",
        "message": "Retail order confirmed for shop festival stock.",
        "items": [
            { "name": "Ground Chakkars – Big", "quantity": 25, "price": 180 },
            { "name": "Sparklers – 30cm", "quantity": 100, "price": 15 }
        ]
    },
];

const enquiriesData = enquiries.map((enquiry) => {
    const statusMap = {
        new: "New",
        contacted: "Contacted",
        quoted: "Quoted",
        converted: "Converted"
    };
    const displayStatus = statusMap[enquiry.status] || enquiry.status;

    return {
        customerInfo: {
            type: "object",
            value: {
                emoji: <FiUser size={15} />,
                name: {
                    subType: "string",
                    subValue: enquiry.customerName
                },
                id: {
                    subType: "string",
                    subValue: enquiry.enquiryNo
                }
            },
            customStyle: "flex justify-between items-center px-3 py-3 bg-gray-200 rounded-full"
        },
        contact: {
            type: "object",
            value: {
                phone: {
                    emoji: <FiPhone />,
                    subType: "string",
                    subValue: enquiry.phone
                },
                email: {
                    emoji: <FiMail />,
                    subType: "string",
                    subValue: enquiry.email
                }
            }
        },
        enquiryDate: {
            type: "string",
            value: enquiry.enquiryDate,
            emoji: <FiCalendar />
        },
        location: {
            type: "string",
            value: enquiry.location,
            customStyle: "text-gray-700"
        },
        estimatedValue: {
            type: "number",
            value: enquiry.totalAmount,
            currency: "₹"
        },
        status: {
            type: "string",
            value: displayStatus,
            customStyle: `${enquiry.status === "new"
                ? "bg-blue-600"
                : enquiry.status === "contacted"
                    ? "bg-yellow-600"
                    : enquiry.status === "quoted"
                        ? "bg-purple-600"
                        : enquiry.status === "converted"
                            ? "bg-green-600"
                            : "bg-gray-500"
                } text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]`
        },
        activity: {
            type: "actions",
            value: {
                markContacted: { label: "Mark as Contacted", action: null },
                markQuoted: { label: "Mark as Quoted", action: null },
                markConverted: { label: "Mark as Converted", action: null }
            }
        },
    };
});


export {
    menu_sub_category,
    summary,
    sampleCustomerStats,
    sampleRevenue,
    sampleProductData,
    sampleRecentOrders,
    sampleLowStockData,
    sampleNotifications,
    salesData,
    sampleUsers,
    estimationData,
    sampleUserData,
    sampleCustomers,
    sampleProducts,
    stockStatusTableData,
    stockMovementTableData,
    lowStockAlertTableData,
    enquiriesData,
    faqData,
    guides
};