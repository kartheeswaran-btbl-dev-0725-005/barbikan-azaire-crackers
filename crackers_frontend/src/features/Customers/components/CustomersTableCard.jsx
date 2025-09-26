import { useState, useEffect } from "react";
import { usePagination } from "../../../shared/hooks/usePagination";
import { useFilteredData } from "../../../shared/hooks/useFilteredData";
import { mapCustomers } from "../constants/data";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import { customerDetails } from "../constants/data";
import apiClient, { getSession } from "@/shared/utils/apiClient";
import Search from "../../../shared/components/common/Search";
import CustomTable from "../../../shared/components/Table/Table";
import TitleCard from "../../../shared/components/ui/TitleCard";
import Modal from "../../../shared/components/ui/Modal";

function CustomersTableCard({ customersFromDb, totalItems }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [customers, setCustomers] = useState([]);

    const tableName = "Customers";
    const customerTableHeaders = [
        { key: "customerInfo", label: "Customer" },
        { key: "contact", label: "Contact" },
        { key: "totalOrders", label: "Total Orders" },
        { key: "totalPurchaseValue", label: "Total Purchase Value" },
        { key: "lastOrder", label: "Last Order" },
        // { key: "actions", label: "Actions" },
    ];

    // const handleEdit = (item) => {
    //     setEditingItem(item);
    //     setOpen(true);
    // };

    // const handleDelete = async (item) => {
    //     try {
    //         const session = getSession();
    //         if (!session) throw new Error("No session found");

    //         await apiClient.delete(
    //             `/customers/${session.tenantId}/${session.organizationId}/${item.customer_id}/delete`
    //         );

    //     } catch (error) {
    //         console.error("Error deleting customer: ", error);
    //         throw error;
    //     }
    // };

    const handleCloseModal = () => setOpen(false);

    const handleSubmit = async (formData) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            if (formData.customer_id) {
                // 📝 Edit existing → PATCH
                await apiClient.put(
                    `/customers/${session.tenantId}/${session.organizationId}/${formData.customer_id}/update`,
                    formData
                );

                // Update state locally
                setCustomers((prev) =>
                    prev.map((cust) =>
                        cust.customer_id === formData.customer_id ? { ...cust, ...formData } : cust
                    )
                );
            } else {
                // ➕ Add new → POST
                const response = await apiClient.post(
                    `/customers/${session.tenantId}/${session.organizationId}/create`,
                    formData
                );

                // Response should include created customer from DB
                const newCustomer = response.data?.customer;
                setCustomers((prev) => [...prev, newCustomer]);
            }

            setOpen(false);
        } catch (error) {
            console.error("❌ Error saving customer:", error);
        }
    };

    // ✅ hook uses totalItems from backend
    const {
        currentPage,
        rowsPerPage,
        totalPages,
        handlePageChange,
        handleLimitChange,
        scrollRef,
    } = usePagination("customerTable", totalItems);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setCustomers(customersFromDb || []);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [customersFromDb]);

    // ✅ add actions
    const customersWithActions = mapCustomers(customers).map((item, idx) => ({
        ...item,
        // actions: {
        //     type: "actions",
        //     value: {
        //         edit: {
        //             subType: "Edit",
        //             subValue: <FiEdit size={15} />,
        //             action: () => handleEdit(customers[idx])
        //         },
        //         delete: {
        //             subType: "Delete",
        //             subValue: <FiTrash2 size={15} />,
        //             action: () => handleDelete(customers[idx])
        //         },
        //     },
        // },

    }));


    // ✅ search filter (applies only on current page data)
    const filteredCustomers = useFilteredData(customersWithActions, {
        nameKey: "customerInfo",
        nameExtractor: (item) => {
            const name = item?.customerInfo?.value?.name?.subValue || "";
            const id = item?.customerInfo?.value?.id?.subValue || "";
            return `${name} ${id}`.trim();
        },
        searchText,
    });

    const modalFields = Object.keys(customerDetails).map((key) => ({
        name: key,
        ...customerDetails[key],
    }));


    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <TitleCard
                        heading="Customers"
                        tagline="A list of all your customers and their information"
                        variant="cardArea"
                    />
                    <Search
                        placeholder="Search Customers..."
                        onChange={(e) => setSearchText(e.target.value)}
                        searchText={searchText}
                        customStyle="w-48"
                    />
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName={tableName}
                        tableHeaders={customerTableHeaders}
                        tableData={filteredCustomers}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onLimitChange={handleLimitChange}
                    />

                </CardContent>
            </Card>
            <Modal
                open={open}
                onClose={handleCloseModal}
                title="Edit Customer"
                subHeading="Edit existing customer information"
                onSubmit={handleSubmit}
                fields={modalFields}
                values={editingItem ? editingItem : {}}
                toggleData={[]}
                buttonText="Update Customer"
            />
        </div>
    );
}

export default CustomersTableCard;
