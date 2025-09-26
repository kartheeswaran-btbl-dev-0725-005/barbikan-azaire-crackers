import {
    sampleUsers,
    sampleProducts,
    stockStatusTableData,
    stockMovementTableData,
    lowStockAlertTableData,
    enquiriesData
} from "./sample_data";



const productManagementtableData = [
    {
        "title": "Products",
        "headers": [
            {
                "key": "productInfo",
                "label": "Product"
            },
            {
                "key": "category",
                "label": "Category"
            },
            {
                "key": "price",
                "label": "Price"
            },
            {
                "key": "stock",
                "label": "Stock"
            },
            {
                "key": "unitType",
                "label": "Unit Type"
            },
            {
                "key": "status",
                "label": "Status"
            },
            {
                "key": "actions",
                "label": "Actions"
            },
        ],
        "data": sampleProducts,
    }
]

const categoryManagementTableData = [
    {
        "title": "Categories",
        "headers": [
            {
                "key": "categoryName",
                "label": "Category Name"
            },
            {
                "key": "description",
                "label": "Description"
            },
            {
                "key": "products",
                "label": "Products"
            },
            {
                "key": "actions",
                "label": "Actions"
            },
        ],
    }
]

const currentStocksManagementTableData = [
    {
        "title": "Current Stock",
        "headers": [
            {
                "key": "productName",
                "label": "Product"
            },
            {
                "key": "categoryName",
                "label": "Category"
            },
            {
                "key": "currentStock",
                "label": "Current Stock"
            },
            {
                "key": "minimumStock",
                "label": "Min Stock"
            },
            {
                "key": "maximumStock",
                "label": "Max Stock"
            },
            {
                "key": "status",
                "label": "Status"
            },
            {
                "key": "lastUpdated",
                "label": "Last Updated"
            },
        ],
        "data": stockStatusTableData
    }
]

const stockMovementsManagementTableData = [
    {
        "title": "Stock Management",
        "headers": [
            {
                "key": "productName",
                "label": "Product"
            },
            {
                "key": "movementType",
                "label": "Type"
            },
            {
                "key": "quantity",
                "label": "Quantity"
            },
            {
                "key": "orderTypeId",
                "label": "Order Type (#ID)"
            },
            {
                "key": "dateTime",
                "label": "Date & Time"
            },
        ],
        "data": stockMovementTableData
    }
]

const lowStockAlertManagementTableData = [
    {
        "title": "Low Stock",
        "headers": [
            {
                "key": "productName",
                "label": "Product"
            },
            {
                "key": "currentStock",
                "label": "Current Stock"
            },
            {
                "key": "minimumStock",
                "label": "Minimum Stock"
            },
            {
                "key": "status",
                "label": "Status"
            },
            {
                "key": "actionNeeded",
                "label": "Action Needed"
            },
        ],
        "data": lowStockAlertTableData,
    }
]

const userManagementTableData = [
    {
        "title": "System Users",
        "headers": [
            {
                "key": "user",
                "label": "User"
            },
            {
                "key": "contact",
                "label": "Contact"
            },
            {
                "key": "role",
                "label": "Role"
            },
            {
                "key": "status",
                "label": "Status"
            },
            {
                "key": "lastLogin",
                "label": "Last Login"
            },
            {
                "key": "actions",
                "label": "Actions"
            },
        ],
        "data": sampleUsers,
    }
]

export {
    productManagementtableData,
    categoryManagementTableData,
    currentStocksManagementTableData,
    stockMovementsManagementTableData,
    lowStockAlertManagementTableData,
    userManagementTableData,
}