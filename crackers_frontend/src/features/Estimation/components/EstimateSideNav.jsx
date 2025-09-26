import { useEffect } from "react";
import { FiX } from "react-icons/fi";

function EstimateSideNav({ isOpen, onClose, estimate }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [isOpen]);

    if (!isOpen || !estimate) return null;

    const readOnlyField = (label, value) => (
        <div className="flex flex-col mb-3">
            <label className="text-gray-500 text-sm mb-1">{label}</label>
            <input
                type="text"
                readOnly
                value={value || "-"}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex max-h-screen overflow-hidden">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Sliding panel */}
            <div className="relative ml-auto w-full overflow-y-auto min-h-[calc(100vh-70px)] max-w-md bg-white shadow-lg h-full transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Fixed Header */}
                <div className="flex justify-between items-center p-4 border-b flex-shrink-0 bg-white z-10">
                    <h2 className="text-lg font-semibold">Estimate Details</h2>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 pb-10">
                    {/* Customer Info */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Customer</h3>
                        {readOnlyField("Name", estimate.customer_name)}
                        {readOnlyField("Phone", estimate.phone)}
                        {readOnlyField("Email", estimate.email)}
                        {readOnlyField("Address", estimate.address)}
                        {readOnlyField(
                            "City, State, Postal Code",
                            `${estimate.city}, ${estimate.state} - ${estimate.postal_code}`
                        )}
                    </div>

                    {/* Estimate Info */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Estimate Info</h3>
                        {readOnlyField("Estimate ID", estimate.estimate_id)}
                        {readOnlyField("Status", estimate.status)}
                        {readOnlyField("Priority", estimate.priority)}
                        {readOnlyField("Total Amount", `₹${estimate.total_amount}`)}
                        {readOnlyField("Notes", estimate.notes)}
                        {readOnlyField("Message", estimate.message)}
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-medium text-gray-700 mb-3">Items</h3>
                        <div className="space-y-2">
                            {estimate.items?.map((item) => (
                                <div
                                    key={item.item_id}
                                    className="flex justify-between bg-gray-50 px-3 py-2 rounded border border-gray-200"
                                >
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>₹{item.subtotal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EstimateSideNav;
