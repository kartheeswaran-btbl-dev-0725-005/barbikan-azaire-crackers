function ToggleButton({ value = false, onToggle }) {
    return (
        <button
            onClick={() => onToggle?.(!value)}
            className={`w-8.5 h-5.5 flex items-center rounded-full transition-colors duration-300 cursor-pointer
                ${value ? "bg-green-500" : "bg-gray-400"}`}
        >
            <div
                className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${value ? "translate-x-3.5" : "translate-x-0.5"}`}
            ></div>
        </button>
    );
}


export default ToggleButton;
