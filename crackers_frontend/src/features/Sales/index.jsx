import TitleCard from "../../shared/components/ui/TitleCard";
import SalesStats from "./components/SalesStats";
import Button from "../../shared/components/ui/Button";
import { salesData } from "../../shared/constants/mockData/sample_data";
import { HiOutlineDownload } from "react-icons/hi";
import ToggleButton from "../../shared/components/common/HeadingToggle";

function Sales() {
    const salesToggleList = ["All Sales", "Invoices", "Reports"];

    return (
        <div className="w-full">
            <div className="flex justify-between items-center">
                <TitleCard
                    heading="Sales"
                    tagline="Track and manage your sales transactions"
                    variant="dashboardSection"
                />
                <div className="flex items-center gap-2">
                    <Button variant="themeInverted" customStyle="flex items-center gap-2">
                        Clear Filters
                    </Button>
                    <Button variant="themeContrast" customStyle="flex items-center gap-2">
                        <HiOutlineDownload size={15} /> Export
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
                <SalesStats salesData={salesData} />
            </div>
            <div>
                {<ToggleButton toggleList={salesToggleList} />}
            </div>
        </div>
    )
}

export default Sales