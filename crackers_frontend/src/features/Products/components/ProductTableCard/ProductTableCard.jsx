import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import Button from "../../../../shared/components/ui/Button";
import DropDown from "../../../../shared/components/ui/DropDown";
import Search from "../../../../shared/components/common/Search";
import CustomTable from "../../../../shared/components/Table/Table";
import Modal from "../../../../shared/components/ui/Modal";
import { FaPlus } from "react-icons/fa6";
import { usePagination } from "../../../../shared/hooks/usePagination";
import { normalizeString, toCamelCase } from "../../../../shared/utils/helperFunctions";
import { getSession } from "@/shared/utils/apiClient";
import apiClient from "@/shared/utils/apiClient";
import { productFields, productTableHeaders } from "../../constants/data";
import mapProductsToTable from "./utils/mapProductsToTable";
import { IMAGE_BASE_URL } from "../../../../shared/utils/apiClient";

function ProductTableCard() {
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [totalItems, setTotalItems] = useState(0);
    const [categories, setCategories] = useState([]);

    // ✅ Pagination driven by API
    const {
        currentPage,
        rowsPerPage,
        totalPages,
        handlePageChange,
        handleLimitChange,
        scrollRef,
    } = usePagination("productTable", totalItems);

    // ✅ Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const session = getSession();
                if (!session) return;

                const response = await apiClient.get(
                    `/categories/${session.tenantId}/${session.organizationId}/lists`,
                    { params: { page: 1, limit: 1000 } }
                );

                const { data } = response.data;
                setCategories(data.filter((f) => f.status == "active") || []);
            } catch (error) {
                console.error("❌ Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // ✅ Extracted fetchProducts so we can reuse it
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const session = getSession();
            if (!session) return;

            const params = {
                page: currentPage,
                limit: rowsPerPage,
            }

            if (statusFilter !== "All Status") {
                params.status = statusFilter.toLowerCase();
            }

            if (categoryFilter !== "All Categories") {
                params.categoryId = categoryFilter;
            }

            if (searchText.trim() !== "") {
                params.productName = searchText.trim();
            }

            const response = await apiClient.get(
                `/products/${session.tenantId}/${session.organizationId}/lists`,
                { params }
            );

            const { data, total_products } = response.data;

            const tableReadyProducts = mapProductsToTable(
                data,
                handleEdit,
                handleDelete
            );

            setProducts(tableReadyProducts || []);
            setTotalItems(total_products || 0);
        } catch (error) {
            console.error("❌ Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load products on page / limit change
    useEffect(() => {
        fetchProducts();
    }, [currentPage, rowsPerPage, searchText, statusFilter, categoryFilter]);

    const handleOpenModal = () => {
        setEditingItem(null);
        setOpen(true);
    };
    const handleCloseModal = () => setOpen(false);

    const handleEdit = (item) => {
        const hasImage = Array.isArray(item.images) && item.images.length > 0;
        const editableItem = {
            ...item,
            images: hasImage ? `${IMAGE_BASE_URL}${item.images[0]}` : null, // full URL for preview
        };
        console.log("Editing Item: ", editableItem);

        setEditingItem(editableItem);
        setOpen(true);
    };

    const handleDelete = async (item) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            await apiClient.delete(
                `/products/${session.tenantId}/${session.organizationId}/${item}/delete`
            );

            // ✅ Refresh products from backend after delete
            await fetchProducts();
        } catch (error) {
            console.error("❌ Error deleting product:", error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            let payload = {
                ...formData,
                name: formData.product_name,
                images: Array.isArray(formData.images)
                    ? formData.images
                    : formData.images
                        ? [formData.images]
                        : [],
            };
            delete payload.product_name;

            payload = toCamelCase(payload);

            // 🔥 Convert to FormData (only files)
            const formDataPayload = new FormData();

            Object.entries(payload).forEach(([key, value]) => {
                if (key === "images") {
                    const imagesArray = Array.isArray(value) ? value : [value];
                    imagesArray.forEach((fileOrUrl) => {
                        if (fileOrUrl instanceof File) {
                            // ✅ only append real files
                            formDataPayload.append("images", fileOrUrl);
                        }
                    });
                } else {
                    formDataPayload.append(key, value ?? "");
                }
            });

            console.log("Final FormData to send:", formDataPayload);

            if (formData.product_id) {
                // Update product
                await apiClient.put(
                    `/products/${session.tenantId}/${session.organizationId}/${formData.product_id}/update`,
                    formDataPayload
                );
            } else {
                // Add product
                await apiClient.post(
                    `/products/${session.tenantId}/${session.organizationId}/add`,
                    formDataPayload
                );
            }

            await fetchProducts();
            setOpen(false);
        } catch (error) {
            console.error("❌ Error saving product:", error);
        }
    };

    const handleStatusChange = async (item, newStatus) => {
        try {
            const session = getSession();
            if (!session) throw new Error("No session found");

            await apiClient.put(
                `/products/${session.tenantId}/${session.organizationId}/${item.product_id}/update`,
                { ...item, status: newStatus }
            );

            // ✅ Refresh products after status change
            await fetchProducts();
        } catch (error) {
            console.error("❌ Error updating product status:", error);
        }
    };

    const categoryOptions = [
        { label: "All Categories", value: "All Categories" },
        ...categories.map((cat) => ({
            label: cat.name,
            value: cat.category_id,
        })),
    ];

    const statusOptions = ["All Status", "Active", "Inactive"];

    const modalFields = Object.keys(productFields).map((key) => {
        if (key === "category_id") {
            return {
                name: key, // important for Modal validation
                ...productFields[key],
                options: categories.map((cat) => ({
                    label: cat.name,
                    value: cat.category_id,
                })),
            };
        }
        return {
            name: key,
            ...productFields[key],
        };
    });

    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <TitleCard
                        heading="Products"
                        tagline="Manage your product inventory"
                        variant="cardArea"
                    />
                    <div className="flex items-center gap-2">
                        <Search
                            placeholder="Search products..."
                            onChange={(e) => setSearchText(e.target.value)}
                            searchTerm={searchText}
                            customStyle="w-48"
                        />
                        <DropDown
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categoryOptions}
                            position="top"
                        />
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
                            <FaPlus /> Add Product
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName="Products"
                        tableHeaders={productTableHeaders}
                        tableData={products}
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
                title={!editingItem ? "Add New Product" : "Edit Product"}
                subHeading={
                    !editingItem
                        ? "Create a new product"
                        : "Edit your existing product"
                }
                onSubmit={handleSubmit}
                fields={modalFields}
                values={editingItem ? editingItem : {}}
                toggleData={[]}
                buttonText={!editingItem ? "Add Product" : "Update Product"}
            />
        </div>
    );
}

export default ProductTableCard;
