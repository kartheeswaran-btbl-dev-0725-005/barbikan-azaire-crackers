import { FiUser, FiPhone, FiMail } from "react-icons/fi";
import formatted from "../utils/formatDate";

// ✅ Form config for Add/Edit Customer aligned with backend fields
const customerDetails = {
    name: {
        label: "Full Name",
        type: "text",
        placeholder: "Enter customer name",
        required: true,
    },
    email: {
        label: "Email Address",
        type: "email",
        placeholder: "Enter email address",
        required: true,
    },
    phone: {
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
    },
    address: {
        label: "Address",
        type: "textarea",
        placeholder: "Enter customer address",
    },
    orders: {
        label: "Total Orders",
        type: "number",
        placeholder: "Enter number of orders",
        min: 0,
    },
    total_spent: {
        label: "Total Spent",
        type: "number",
        placeholder: "Enter total spent amount",
        min: 0,
        step: "0.01", // ✅ allows decimals
    },
};

// Utility to map DB data -> Frontend table format
const mapCustomers = (customersFromDb) => {

    console.log("Customers: ", customersFromDb);

    return customersFromDb.map((cust) => ({
        customerInfo: {
            type: "object",
            value: {
                emoji: <FiUser size={15} />,
                name: { subType: "string", subValue: cust.name || "N/A" },
                id: {
                    subType: "string", subValue: cust.
                        customer_code || "N/A"
                },
            },
            customStyle:
                "flex justify-between items-center px-3 py-3 bg-gray-200 rounded-full",
        },
        contact: {
            type: "object",
            value: {
                phone: { emoji: <FiPhone />, subType: "string", subValue: cust.phone || "N/A" },
                email: { emoji: <FiMail />, subType: "string", subValue: cust.email || "N/A" },
            },
        },
        totalOrders: {
            type: "number",
            value: cust?.orders ?? 0,
        },
        totalPurchaseValue: {
            type: "number",
            value: parseFloat(cust.total_spent) || 0,
            currency: "₹",
        },
        lastOrder: {
            type: "string",
            value: (cust.last_order) || "-",
        },
        // actions: {
        //     type: "actions",
        //     value: {
        //         edit: { subType: null, subValue: null, action: null },
        //         delete: { subType: null, subValue: null, action: null },
        //     },
        // },
    }));
};

// Generate table data dynamically (instead of static `customersFromDb`)
const customerManagementtableData = (customersFromDb) => [
    {
        title: "Customers",
        data: mapCustomers(customersFromDb),
    },
];

export { customerDetails, mapCustomers, customerManagementtableData };