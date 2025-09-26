// import product_logo from "../assets/azaire.png";
import { BsBoxSeam } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { menu_sub_category } from "../../constants/mockData/sample_data";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedItem } from "../../../app/slices/layoutSlice";
import { FiLogOut } from "react-icons/fi";

function SideBar({ isOpen, userName, email }) {
    // This component renders a sidebar with navigation links and a user profile section.

    const dispatch = useDispatch();
    const selectedItem = useSelector((state) => state.layout.selectedItem);

    const handleLogout = async () => {
        try {
            // (Optional) Call backend logout endpoint if available
            // await axios.post(`${import.meta.env.VITE_AZAIRE_SERVER}/tenants/logout`, {}, { withCredentials: true });

            // Clear local storage/session storage tokens if you saved any
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("name");
            localStorage.removeItem("organizationId");
            localStorage.removeItem("tenantId");

            // Reset redux state if needed
            dispatch(setSelectedItem(null));

            window.location.reload();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <aside className={`fixed h-screen z-10 ${isOpen ? "w-60" : "w-0"} transition-all duration-500 ease-in-out overflow-x-hidden`}>
            <div className=" flex flex-col h-full justify-between border-r-2 border-gray-100 bg-white transition-all duration-300 ease-in-out">
                <div>
                    <div className="flex items-center p-3 border-b-2 border-gray-100 gap-3">
                        <div className="p-2 bg-[#030213] text-gray-50 rounded-lg">
                            <BsBoxSeam />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-semibold">Azaire</h1>
                            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Crackers</p>
                        </div>
                    </div>
                    <ul className="space-y-1 px-2 mt-2">
                        {menu_sub_category.map((item, idx) => {
                            const isActive = selectedItem === item.label;
                            return (
                                <li
                                    key={idx}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer
                                    ${isActive ? "bg-[#F5F5F5] font-semibold text-[#171717]" : "hover:bg-[#F5F5F5]"}
                                    transition-all duration-300 ease-in-out`}
                                    onClick={() => dispatch(setSelectedItem(item.label))}
                                >
                                    <span>{item.icon}</span>
                                    <span className="block text-nowrap text-xs">{item.label}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <footer className="flex items-center justify-between p-3 gap-2 border-t-2 border-gray-100 text-sm cursor-pointer">
                    <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-muted)" }}>
                        <FaUserCircle size={25} />
                        <div>
                            <p className="text-xs text-black font-semibold">{userName}</p>
                            <p className="text-[10px] text-gray-500">
                                {email}
                            </p>
                        </div>
                    </div>
                    <FiLogOut
                        size={20}
                        className="cursor-pointer text-gray-500 hover:text-black transition-colors"
                        onClick={handleLogout}
                    />
                </footer>
            </div>
        </aside >
    );
}

export default SideBar;
