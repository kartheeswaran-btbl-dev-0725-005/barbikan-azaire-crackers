import { useRef, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function Accordion({ title, children, isOpen, onClick }) {
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    // Update height when open state changes
    useEffect(() => {
        if (isOpen && contentRef.current) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight("0px");
        }
    }, [isOpen]);

    return (
        <div className="border-b border-gray-200 text-xs">
            {/* Header */}
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none hover:underline"
            >
                <span className="font-medium text-gray-800">{title}</span>
                <IoIosArrowDown
                    size={12}
                    className={`text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>

            {/* Content */}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight,
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="pb-3 text-gray-600">{children}</div>
            </div>
        </div>
    );
}

export default Accordion;
