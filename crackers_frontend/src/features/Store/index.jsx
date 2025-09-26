import { useState } from "react";
import TitleCard from "../../shared/components/ui/TitleCard";
import GeneralTableCard from "./components/GeneralTableCard";
import PaymentTableCard from "./components/PaymentTable/index";
import AppearanceTableCard from "./components/AppearanceTableCard";
import NotificationsTableCard from "./components/NotificationsTableCard";
import HeadingToggle from "../../shared/components/common/HeadingToggle";

function StoreSettings() {
    const storeSettingsToggleList = ["General", "Payment", "Appearance", "Notifications"];
    const [selectedOption, setSelectedOption] = useState(storeSettingsToggleList[0]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <TitleCard
                    heading="Store Settings"
                    tagline="Configure your store preferences and settings"
                    variant="dashboardSection"
                />
            </div>
            <div className="flex flex-col gap-2 mb-5">
                {<HeadingToggle toggleList={storeSettingsToggleList} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}
                {selectedOption === "General" && <GeneralTableCard />}
                {selectedOption === "Payment" && <PaymentTableCard />}
                {selectedOption === "Appearance" && <AppearanceTableCard />}
                {selectedOption === "Notifications" && <NotificationsTableCard />}
            </div>
        </div>
    )
}

export default StoreSettings