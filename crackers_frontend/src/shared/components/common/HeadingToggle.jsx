import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";

function HeadingToggle({ toggleList, selectedOption, setSelectedOption, customStyle = "" }) {
    const containerRef = useRef(null);
    const [positions, setPositions] = useState([]);

    // Track x and width of each toggle
    useLayoutEffect(() => {
        if (containerRef.current) {
            const children = Array.from(containerRef.current.children);
            const rects = children.map(child => {
                const { offsetLeft: x, offsetWidth: width } = child;
                return { x, width };
            });
            setPositions(rects);
        }
    }, [toggleList, selectedOption]);

    const selectedIndex = toggleList.indexOf(selectedOption);

    return (
        <div className={`relative bg-gray-200 w-fit rounded-xl px-1 py-1 ${customStyle}`}>
            <div ref={containerRef} className="flex relative z-10 text-xs font-semibold">
                {toggleList.map((item, index) => (
                    <div
                        key={index}
                        className={`px-3 py-1 cursor-pointer transition-colors duration-200 text-black
                            }`}
                        onClick={() => setSelectedOption(item)}
                    >
                        {item}
                    </div>
                ))}
            </div>

            {positions[selectedIndex] && (
                <motion.div
                    className="absolute top-1 left-1 h-[calc(100%-0.5rem)] bg-white rounded-full z-0"
                    animate={{
                        width: positions[selectedIndex].width,
                        x: positions[selectedIndex].x,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </div>
    );
}

export default HeadingToggle;
