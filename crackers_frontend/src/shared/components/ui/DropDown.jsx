import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

function DropDown({ id, value, label, onChange, options, placeholder, position = "top" }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Auto-select first option if no value & no placeholder
    useEffect(() => {
        if (!placeholder && !value && options?.length > 0) {
            const first = options[0];
            // Handle both object {label, value} and string
            onChange(typeof first === "object" ? first.value : first);
        }
    }, [placeholder, value, options, onChange]);

    const handleOptionClick = (option) => {
        const selected = typeof option === "object" ? option.value : option;
        onChange(selected);
        setOpen(false);
    };

    const displayValue = (() => {
        if (!value && placeholder) return placeholder;

        const selectedOption = options.find((opt) =>
            typeof opt === "object" ? opt.value === value : opt === value
        );

        return selectedOption
            ? typeof selectedOption === "object"
                ? selectedOption.label
                : selectedOption
            : "";
    })();

    return (
        <div id={id} className="relative" ref={dropdownRef}>
            {label && <label className="text-xs font-medium text-gray-700">{label}</label>}
            <div
                tabIndex={0}
                onClick={() => setOpen((prev) => !prev)}
                className={`flex items-center justify-between text-xs rounded-md px-3 py-2 min-w-32 w-full cursor-pointer 
                    ${!value && placeholder ? "text-gray-400 bg-gray-100" : "text-gray-900 bg-gray-100"}`}
            >
                <span className="truncate w-full mr-1">{displayValue}</span>
                <IoIosArrowDown className="ml-1 text-gray-400" />
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${position === "top" ? "top-9" : "bottom-9"} ${label && "top-15"}
                           min-w-full max-h-32 overflow-y-auto p-1.5 text-xs bg-white border border-gray-100 rounded-md z-10 shadow`}
                    >
                        {options.map((item, index) => {
                            const optValue = typeof item === "object" ? item.value : item;
                            const optLabel = typeof item === "object" ? item.label : item;
                            return (
                                <div
                                    key={index}
                                    onClick={() => handleOptionClick(item)}
                                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                >
                                    <span>{optLabel}</span>
                                    {value === optValue && <FiCheck className="text-gray-500" />}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DropDown;
