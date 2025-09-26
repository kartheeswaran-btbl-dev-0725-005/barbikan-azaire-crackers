import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import Button from "../../../shared/components/ui/Button";
import DropDown from "../../../shared/components/ui/DropDown";
import CustomTable from "../../../shared/components/Table/Table";
import { FaPlus } from "react-icons/fa6";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "../../../shared/components/ui/Modal";
import { categoryFields, categoryTableHeaders } from "../constants/data";
import apiClient, { getSession } from "@/shared/utils/apiClient";
import { usePagination } from "../../../shared/hooks/usePagination";
import { normalizeString } from "../../../shared/utils/helperFunctions";

function CategoryTableCard({ totalCategories }) {
    const [categories, setCategories] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [totalItems, setTotalItems] = useState(0);

    // ✅ Pagination hook (now driven by totalItems from API)
    const {
        currentPage,
        rowsPerPage,
        totalPages,
        handlePageChange,
        handleLimitChange,
        scrollRef,
    } = usePagination("categoryTable", totalItems);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const session = getSession();
            if (!session) return;

            const response = await apiClient.get(
                `/categories/${session.tenantId}/${session.organizationId}/lists`,
                { params: { page: currentPage, limit: rowsPerPage } }
            );

            const { data, total_categories } = response.data;

            setCategories(data || []);
            setTotalItems(total_categories || 0);
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, [currentPage, rowsPerPage]);

    const handleOpenModal = () => {
        setEditingItem(null);
        setOpen(true);
    };
    const handleCloseModal = () => setOpen(false);

    const handleEdit = (item) => {
        const editableItem = {
            ...item,
            groupBy: item.group_by, // backend → frontend for the modal
        };
        setEditingItem(editableItem);
        setOpen(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            const payload = {
                ...formData,
                group_by: formData.groupBy,
            };
            delete payload.groupBy;

            const updatedItem = {
                ...formData, // keep frontend keys for modal 
                group_by: payload.group_by, // backend key for table mapping 
            };

            if (formData.category_id) {
                // Update
                await apiClient.put(
                    `/categories/${session.tenantId}/${session.organizationId}/${formData.category_id}/update`,
                    formData
                );
                setCategories((prev) => prev.map((cat) => cat.category_id === formData.category_id ? updatedItem : cat));
                setOpen(false);
            } else {
                // Add
                const response = await apiClient.post(
                    `/categories/${session.tenantId}/${session.organizationId}/add`,
                    formData
                );
                console.log(formData);

                const newCategory = response.data?.category;
                if (newCategory) { // map to both keys for table & modal 
                    const newCatWithKeys = { ...newCategory, groupBy: newCategory.group_by, }; setCategories((prev) => [...prev, newCatWithKeys]);
                }

                // 🔄 Refresh table from API
                await fetchCategories();

                setOpen(false);
            }

        } catch (error) {
            console.error("❌ Error saving category:", error);
        }
    };

    const handleDelete = async (item) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            await apiClient.delete(
                `/categories/${session.tenantId}/${session.organizationId}/${item.category_id}/delete`
            );

            // 🔄 Refresh table from API
            await fetchCategories();
        } catch (error) {
            console.error("❌ Error deleting category:", error);
        }
    };


    const handleStatusChange = async (item, newStatus) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            await apiClient.put(
                `/categories/${session.tenantId}/${session.organizationId}/${item.category_id}/update`,
                { ...item, status: newStatus }
            );

            setCategories((prev) =>
                prev.map((cat) =>
                    cat.category_id === item.category_id ? { ...cat, status: newStatus } : cat
                )
            );
        } catch (error) {
            console.error("❌ Error updating status:", error);
        }
    };

    // 🔍 Apply status filter
    const filteredCategories =
        statusFilter === "All Status"
            ? categories
            : categories.filter(
                (cat) => cat.status?.toLowerCase() === statusFilter.toLowerCase()
            );

    // ✅ Map categories to table format
    const categoriesWithActions = filteredCategories.map((item) => ({
        name: { type: "string", value: item.name },
        groupBy: {
            type: "string",
            value: normalizeString(item.group_by),
            customStyle:
                "inline-block px-2 py-1 rounded-lg bg-gray-100 font-semibold text-[11px] text-gray-800",
        },
        description: { type: "string", value: item.description },
        status: {
            type: "status",
            value: normalizeString(item.status),
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
                    action: () => handleDelete(item),
                },
            },
        },
    }));

    const modalFields = Object.keys(categoryFields).map((key) => ({
        name: key,
        ...categoryFields[key],
    }));


    const statusOptions = [
        "All Status",
        "Active",
        "Inactive",
    ];

    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <TitleCard
                        heading="Categories"
                        tagline="Manage product categories"
                        variant="cardArea"
                    />
                    <div className="flex items-center gap-2">
                        <DropDown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            position="top"
                        />
                        <Button
                            variant="themeContrast"
                            customStyle="flex items-center gap-2"
                            onClick={handleOpenModal}
                        >
                            <FaPlus /> Add Category
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName="Categories"
                        tableHeaders={categoryTableHeaders}
                        tableData={categoriesWithActions}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onLimitChange={handleLimitChange}
                        onStatusChange={handleStatusChange}
                    />
                </CardContent>
            </Card>

            <Modal
                open={open}
                onClose={handleCloseModal}
                title={!editingItem ? "Add New Category" : "Edit Category"}
                subHeading={
                    !editingItem
                        ? "Create a new product category"
                        : "Edit your existing category"
                }
                onSubmit={handleSubmit}
                fields={modalFields}
                values={editingItem ? editingItem : {}}
                toggleData={[]}
                buttonText={!editingItem ? "Add Category" : "Update Category"}
            />
        </div>
    );
}

export default CategoryTableCard;