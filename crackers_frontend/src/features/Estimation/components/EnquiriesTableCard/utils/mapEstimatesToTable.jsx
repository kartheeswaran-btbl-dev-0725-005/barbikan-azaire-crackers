import { FiPhone, FiMail, FiUser } from "react-icons/fi";
import { normalizeString } from "../../../../../shared/utils/helperFunctions";

function mapEstimatesToTable(estimates, renderEngagement) {
    const statusStyles = {
        new: "bg-green-500 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        contacted: "bg-yellow-500 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        paid: "bg-green-700 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        couriered: "bg-blue-500 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        delivered: "bg-gray-500 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        canceled: "bg-red-500 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        refunded: "bg-red-700 text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]",
        default: "bg-gray-300 text-black inline-block px-2 py-1 rounded-lg font-semibold text-[11px]", // fallback
    };

    return estimates.map((estimate) => {
        const normalizedStatus = normalizeString(estimate.status) || "default";
        return {
            customerInfo: {
                type: "object",
                value: {
                    emoji: <FiUser size={15} />,
                    name: {
                        subType: "string",
                        subValue: estimate.customer_name,
                    },
                    id: {
                        subType: "string",
                        subValue: estimate.estimate_code,
                    },
                },
                customStyle:
                    "flex justify-between items-center px-3 py-3 bg-gray-200 rounded-full",
            },
            contact: {
                type: "object",
                value: {
                    phone: {
                        emoji: <FiPhone />,
                        subType: "string",
                        subValue: estimate.phone,
                    },
                    email: {
                        emoji: <FiMail />,
                        subType: "string",
                        subValue: estimate.email,
                    },
                },
            },
            enquiryDate: { type: "string", value: estimate.createdAt },
            location: {
                type: "string",
                value: `${estimate.city}, ${estimate.state}`,
                customStyle: "text-gray-700",
            },
            estimatedValue: {
                type: "number",
                value: estimate.total_amount,
                currency: "₹",
            },
            status: {
                type: "string",
                value: normalizeString(estimate.status) || "Unknown",
                customStyle: statusStyles[estimate.status] || statusStyles.default,
            },
            activity: {
                type: "custom",
                value: renderEngagement(estimate),
            },
        };
    });
}

export default mapEstimatesToTable;
