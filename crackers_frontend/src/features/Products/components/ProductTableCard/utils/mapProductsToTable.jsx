import { FiBox, FiEdit, FiTrash2 } from "react-icons/fi";
import { normalizeString } from "../../../../../shared/utils/helperFunctions";
import { IMAGE_BASE_URL } from "../../../../../shared/utils/apiClient";

const mapProductsToTable = (products, handleEdit, handleDelete) => {
    return products.map((item) => {
        const hasImage = Array.isArray(item.images) && item.images.length > 0;
        const imageUrl = hasImage ? `${IMAGE_BASE_URL}${item.images[0]}` : null;

        return {
            productInfo: {
                type: "object",
                value: {
                    images: imageUrl, // ✅ now full URL, not just filename
                    emoji: hasImage ? (
                        <img
                            src={imageUrl}
                            alt={item.product_name}
                            className="w-6 h-6 object-cover rounded-sm"
                        />
                    ) : (
                        <FiBox size={20} />
                    ),
                    name: { subType: "string", subValue: item.product_name },
                    id: { subType: "string", subValue: item.product_code },
                },
                customStyle: hasImage
                    ? "flex items-center gap-2"
                    : "flex items-center gap-2 p-2 bg-gray-900 text-gray-100 rounded-md",
            },
            category: {
                id: item.category_id,
                type: "string",
                value: item.category_name || "Uncategorized",
                customStyle:
                    "inline-block px-2 py-1 rounded-lg bg-gray-100 font-semibold text-[11px] text-gray-800",
            },
            price: {
                type: "number",
                value: item.price,
                customStyle: "line-through text-gray-400",
                currency: "₹",
            },
            discount: {
                type: "number",
                value: `${item.discount}%`,
                customStyle: "text-red-500 font-black",
            },
            discountedPrice: {
                type: "number",
                value: item.price - (item.price * item.discount) / 100,
                customStyle: "font-bold",
                currency: "₹",
            },
            status: {
                type: "string",
                value: normalizeString(item.status),
                customStyle: `${item.status?.toLowerCase() === "active"
                    ? "bg-green-600"
                    : "bg-red-600"
                    } text-white inline-block px-2 py-1 rounded-lg font-semibold text-[11px]`,
            },
            packSize: {
                type: "string",
                value:
                    item.pack_content && item.unit_type
                        ? `${item.pack_content}/${item.unit_type}`
                        : item.pack_content || item.unit_type,
            },
            actions: {
                type: "actions",
                value: {
                    edit: {
                        subType: "Edit",
                        subValue: <FiEdit size={15} />,
                        action: () => handleEdit(item),
                    },
                    delete: {
                        subType: "Delete",
                        subValue: <FiTrash2 size={15} />,
                        action: () => handleDelete(item.product_id),
                    },
                },
            },
        };
    });
};

export default mapProductsToTable;
