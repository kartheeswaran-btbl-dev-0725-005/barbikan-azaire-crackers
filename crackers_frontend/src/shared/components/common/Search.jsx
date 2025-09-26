import { HiMiniMagnifyingGlass } from "react-icons/hi2";

function Search(props) {
    // This component is used to render the search input field

    const { searchTerm, placeholder, onChange, customStyle } = props;

    return (
        <div className={`relative ${customStyle}`}>
            <HiMiniMagnifyingGlass
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                size={15}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onChange}
                className="text-xs text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-all duration-200 w-full pl-8 pr-3 py-2"
            />
        </div>
    )
}

export default Search