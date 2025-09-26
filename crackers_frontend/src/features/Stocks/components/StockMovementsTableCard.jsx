import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent } from "../../../shared/components/ui/Card";
import TitleCard from "../../../shared/components/ui/TitleCard";
import Search from "../../../shared/components/common/Search";
import DropDown from "../../../shared/components/ui/DropDown";
import CustomTable from "../../../shared/components/Table/Table";
import { stockMovementsManagementTableData } from "../../../shared/constants/mockData/sample_table_data";
import { usePagination } from "../../../shared/hooks/usePagination";
import { useFilteredData } from "../../../shared/hooks/useFilteredData";

function StockMovementsTableCard() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [movementFilter, setMovementFilter] = useState("All Stocks");

    const tableName = stockMovementsManagementTableData[0].title;
    const productTableHeaders = stockMovementsManagementTableData[0].headers;
    const productsData = stockMovementsManagementTableData[0].data;

    const movementOptions = [
        "All Stocks",
        ...new Set(productsData.map((item) => item?.movementType?.value?.name?.subValue))
    ];

    console.log(movementFilter);


    const filteredProducts = useFilteredData(products, {
        statusKey: "",
        categoryKey: "movementType",
        nameKey: "productName",
        nameExtractor: (item) =>
            item?.productName?.value?.name?.subValue ||
            item?.productName?.value ||
            "",
        statusFilter: "",
        categoryFilter: movementFilter,
        searchText,
        categoryMatchFn: (categoryValue, filter) =>
            !filter || filter === "All Stocks" || categoryValue.toLowerCase() === filter.toLowerCase()
    });


    const {
        currentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        currentItems,
        handlePageChange,
        scrollRef,
    } = usePagination(filteredProducts, 10);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setProducts(productsData);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [productsData]);

    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <TitleCard
                        heading="Recent Stock Movements"
                        tagline="Track all stock in/out transactions"
                        variant="cardArea"
                    />
                    <div className="flex items-center justify-between gap-2">
                        <Search
                            placeholder="Search products..."
                            onChange={(e) => setSearchText(e.target.value)}
                            searchTerm={searchText}
                            customStyle="w-48"
                        />
                        <DropDown
                            value={movementFilter}
                            onChange={setMovementFilter}
                            options={movementOptions}
                            position="top"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName={tableName}
                        tableHeaders={productTableHeaders}
                        tableData={filteredProducts}
                        currentItems={currentItems}
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
    );
}

export default StockMovementsTableCard;
