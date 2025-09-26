import { useState } from "react";
import TitleCard from "../../shared/components/ui/TitleCard";
import ToggleButton from "../../shared/components/common/HeadingToggle";
import FaqCard from "./components/FaqCard";
import UserGuides from "./components/UserGuides";
import ContactCard from "./components/Contact";

function Help() {
    const supportToggleList = ["FAQ", "User Guides", "Contact Support"];
    const [selectedOption, setSelectedOption] = useState(supportToggleList[0]);

    return (
        <div className="w-full">
            <TitleCard
                heading="Support & Help"
                tagline="Get help and support for using Azaire POS"
                variant="dashboardSection"
            />
            <div className="flex flex-col gap-2 mt-5">
                {<ToggleButton toggleList={supportToggleList} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />}
                {selectedOption === "FAQ" && <FaqCard />}
                {selectedOption === "User Guides" && <UserGuides />}
                {selectedOption === "Contact Support" && <ContactCard />}
            </div>
        </div>
    )
}

export default Help