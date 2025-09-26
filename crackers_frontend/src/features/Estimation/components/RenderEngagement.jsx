import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEye, FiDownload, FiPrinter, FiRefreshCw } from "react-icons/fi";
import DropDown from "@/shared/components/ui/DropDown"; // your existing DropDown component

function EngagementMenu({ item, onStatusChange, onPrint, onViewMore, onDownload }) {
    const status = item?.status?.value?.toLowerCase();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(status || "");
    const [openUp, setOpenUp] = useState(false);

    const menuRef = useRef(null);
    const triggerRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const statusOptions = [
        { value: "new", label: "New" },
        { value: "contacted", label: "Contacted" },
        { value: "paid", label: "Paid" },
        { value: "couriered", label: "Couriered" },
        { value: "delivered", label: "Delivered" },
        { value: "canceled", label: "Canceled" },
        { value: "refunded", label: "Refunded" },
    ];

    const commonStyle =
        "flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50";

    // Hover logic
    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };
    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 100);
    };

    // Toggle modal
    const handleOpenModal = () => {
        setNewStatus(status); // reset to current status
        setIsModalOpen(true);
        setIsOpen(false); // close dropdown
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleStatusSave = () => {
        onStatusChange(item, newStatus);
        setIsModalOpen(false);
    };

    // Open menu upwards if not enough space
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 140; // approximate dropdown height
            setOpenUp(spaceBelow < menuHeight);
        }
    }, [isOpen]);

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (status === "converted") return null;

    return (
        <div className="flex justify-center items-center relative">
            <div
                className="relative"
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button className="p-1 hover:bg-gray-100 rounded">
                    <FiMoreVertical size={14} className="text-gray-600" />
                </button>

                {isOpen && (
                    <div
                        ref={menuRef}
                        className={`absolute right-0 w-44 bg-white shadow-lg rounded-md border border-gray-100 z-10 py-2
                        ${openUp ? "bottom-full mb-1" : "mt-1"}`}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className={commonStyle} onClick={() => onViewMore?.(item)}>
                            <FiEye size={12} /> View More
                        </button>
                        <button className={commonStyle} onClick={() => onPrint?.(item)}>
                            <FiPrinter size={12} /> Print
                        </button>
                        <button className={commonStyle} onClick={() => onDownload?.(item)}>
                            <FiDownload size={12} /> Download Report
                        </button>

                        {status !== "converted" && (
                            <button className={commonStyle} onClick={handleOpenModal}>
                                <FiRefreshCw size={12} /> Change Status
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Status Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-md shadow-lg w-80 p-6">
                        <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                        <DropDown
                            value={newStatus}
                            onChange={setNewStatus}
                            options={statusOptions}
                            placeholder="Select new status"
                        />
                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusSave}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EngagementMenu;
