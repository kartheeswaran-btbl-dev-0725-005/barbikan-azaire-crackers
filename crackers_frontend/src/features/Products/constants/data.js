const categoryFields = {
    name: {
        label: "Category Name",
        type: "text",
        placeholder: "Enter category name",
        required: true,
    },
    groupBy: {
        label: "Group By",
        type: "select",
        options: [
            { label: "Retail", value: "Retail" },
            { label: "Combo Pack", value: "Combo Pack" },
            { label: "Wholesale", value: "Wholesale" },
            { label: "Gift Box", value: "Gift Box" },
            { label: "Family Pack", value: "Family Pack" },
            { label: 'Blue Star', value: 'Blue Star' }
        ],
        placeholder: "Select group",
        required: true,
    },
    description: {
        label: "Description",
        type: "textarea",
        placeholder: "Enter category description"
    },
    status: {
        type: "select",
        label: "Status",
        required: true,
        placeholder: "Select status",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
    },
};

// Table headers
const categoryTableHeaders = [
    { key: "name", label: "Category Name" },
    { key: "groupBy", label: "Group" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
];

const productFields = {
    product_name: {
        label: "Product Name",
        type: "text",
        placeholder: "Enter product name",
        required: true,
    },
    images: {
        label: "Product Image",
        type: "file",
        placeholder: "Upload product image",
        accept: "image/*",
        required: false,
    },
    price: {
        label: "Price",
        type: "number",
        placeholder: "Enter price",
        required: true,
    },
    stock_quantity: {
        label: "Stock Quantity",
        type: "number",
        placeholder: "Enter stock quantity",
    },
    minimum_stock: {
        label: "Minimum Stock",
        type: "number",
        placeholder: "Enter minimum stock",
    },
    maximum_stock: {
        label: "Maximum Stock",
        type: "number",
        placeholder: "Enter maximum stock",
    },
    status: {
        label: "Status",
        type: "select",
        required: true,
        placeholder: "Select status",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
    },
    category_id: {
        label: "Category",
        type: "select",
        required: true,
        placeholder: "Select category",
        options: [], // injected dynamically
    },
    unit_type: {
        label: "Unit Type",
        type: "text",
        placeholder: "Enter the quantity (Eg., Box, PKT.)"
    },
    pack_content: {
        label: "Quantity Per Unit",
        type: "text",
        placeholder: "Enter the number of pieces (Eg., 10 PCS)"
    },
    discount: {
        label: "Discount",
        type: "number",
        placeholder: "Enter the discount"
    }
};

const productTableHeaders = [
    { key: "productInfo", label: "Product Info" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "discount", label: "Discount" },
    { key: "discountedPrice", label: "Discounted Price" },
    { key: "status", label: "Status" },
    { key: "packSize", label: "Pack Size" },
    { key: "actions", label: "Actions" },
];

export { categoryFields, categoryTableHeaders, productFields, productTableHeaders };