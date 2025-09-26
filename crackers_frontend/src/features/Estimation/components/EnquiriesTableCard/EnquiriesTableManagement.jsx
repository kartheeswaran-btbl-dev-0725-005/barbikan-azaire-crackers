import { useState, useEffect } from "react";
import { usePagination } from "../../../../shared/hooks/usePagination";
import {
    Card,
    CardHeader,
    CardContent
} from "../../../../shared/components/ui/Card";
import { enquiriesManagementTableHeaders } from "../../constants/data";
import mapEstimatesToTable from "./utils/mapEstimatesToTable";
import Search from "../../../../shared/components/common/Search";
import DropDown from "../../../../shared/components/ui/DropDown";
import CustomTable from "../../../../shared/components/Table/Table";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import EngagementMenu from "../RenderEngagement";
import EstimateSideNav from "../EstimateSideNav";
import apiClient, { getSession } from '@/shared/utils/apiClient';
import { downloadEstimate, printEstimate } from "./utils/generateEstimate";
import { transformEstimateForBackend } from "./utils/transformEstimateForBackend";
import { normalizeString } from "@/shared/utils/helperFunctions";

function EnquiriesTableManagement() {
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [searchText, setSearchText] = useState("");
    const [enquiries, setEnquiries] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedEstimate, setSelectedEstimate] = useState(null);
    const [isSidenavOpen, setIsSidenavOpen] = useState(false);

    // ✅ Pagination (API-driven like Products)
    const {
        currentPage,
        rowsPerPage,
        totalPages,
        handlePageChange,
        handleLimitChange,
        scrollRef,
    } = usePagination("Enquiry Table", totalItems);

    const handleStatusChange = async (item, newStatus) => {
        const session = getSession();
        if (!session) return;

        const payload = transformEstimateForBackend(item);

        setLoading(true);
        try {
            await apiClient.put(
                `/estimates/${session.tenantId}/${session.organizationId}/${item.estimate_id}/update`,
                { ...payload, status: newStatus }
            );

            // 🔄 Refresh after status update
            await fetchEnquiries();
        } catch (error) {
            console.error("❌ Failed to update status:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewMore = (estimate) => {
        setSelectedEstimate(estimate);
        setIsSidenavOpen(true);
    };

    const closeSideNav = () => {
        setIsSidenavOpen(false);
        setSelectedEstimate(null);
    };

    const renderEngagement = (item) => (
        <EngagementMenu
            item={item}
            onStatusChange={handleStatusChange}
            onPrint={printEstimate}
            onDownload={downloadEstimate}
            onViewMore={handleViewMore}
        />
    );

    // ✅ Fetch Enquiries from API with pagination
    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const session = getSession();
            if (!session) return;

            const response = await apiClient.get(
                `/estimates/${session.tenantId}/${session.organizationId}/lists`,
                { params: { page: currentPage, limit: rowsPerPage } }
            );

            const { data, total_estimates } = response.data;

            const tableReadyEnquiries = mapEstimatesToTable(data, renderEngagement);

            setEnquiries(tableReadyEnquiries || []);
            setTotalItems(total_estimates || 0);
        } catch (error) {
            console.error("❌ Error fetching enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Load enquiries on page/limit change
    useEffect(() => {
        fetchEnquiries();
    }, [currentPage, rowsPerPage]);

    // 🔍 Apply filters (status + search)
    const filteredEnquiries = enquiries.filter((e) => {
        const statusMatch =
            statusFilter === "All Status" ||
            normalizeString(e.status?.value) === normalizeString(statusFilter);

        const searchMatch =
            !searchText ||
            e.customerInfo?.value?.name?.subValue?.toLowerCase().includes(searchText.toLowerCase()) ||
            e.customerInfo?.value?.id?.subValue?.toLowerCase().includes(searchText.toLowerCase());

        return statusMatch && searchMatch;
    });

    const statusOptions = [
        "All Status",
        ...new Set(enquiries.map(item => item?.status?.value)),
    ];

    return (
        <div ref={scrollRef}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <TitleCard
                        heading="Enquiries"
                        tagline="Manage and track all your enquiries"
                        variant="cardArea"
                    />
                    <div className="flex justify-between items-center gap-4">
                        <Search
                            placeholder="Search Enquiries..."
                            onChange={(e) => setSearchText(e.target.value)}
                            searchText={searchText}
                            customStyle="w-48"
                        />
                        <DropDown
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            position="top"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    <CustomTable
                        tableName="Enquiries"
                        tableHeaders={enquiriesManagementTableHeaders}
                        tableData={filteredEnquiries}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onLimitChange={handleLimitChange}
                    />
                </CardContent>
            </Card>

            {/* SideNav */}
            <EstimateSideNav
                isOpen={isSidenavOpen}
                onClose={closeSideNav}
                estimate={selectedEstimate}
            />
        </div>
    );
}

export default EnquiriesTableManagement;
