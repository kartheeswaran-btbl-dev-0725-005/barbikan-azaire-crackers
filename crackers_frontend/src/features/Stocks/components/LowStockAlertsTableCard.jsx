import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import usePagination from "@mui/material/usePagination";
import CustomTable from "../../../shared/components/Table/Table";
import { FiAlertTriangle } from "react-icons/fi";
import { lowStockAlertManagementTableData } from "../../../shared/constants/mockData/sample_table_data";

function LowStockAlertsTableCard() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const tableName = lowStockAlertManagementTableData[0].title;
    const productTableHeaders = lowStockAlertManagementTableData[0].headers;
    const productsData = lowStockAlertManagementTableData[0].data;

    const {
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        handlePageChange,
        scrollRef,
    } = usePagination(products, 10);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setProducts(productsData);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <TitleCard
                        heading="Low Stock Alerts"
                        icon={<FiAlertTriangle size={15} />}
                        tagline="Items that require immediate attention"
                        variant="cardArea"
                        customStyles={{
                            titleClass: "flex items-center gap-2",
                            iconClass: "text-orange-500"
                        }}
                    />
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName={tableName}
                        tableHeaders={productTableHeaders}
                        tableData={products}
                        currentItems={products}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        setRowsPerPage={setRowsPerPage}
                        rowsPerPage={rowsPerPage}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default LowStockAlertsTableCard