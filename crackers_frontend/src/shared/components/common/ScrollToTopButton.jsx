import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function ScrollToTopButton({ scrollRef }) {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollRef?.current;

        const handleScroll = () => {
            if (!scrollContainer) return;
            const scrollPosition = scrollContainer.scrollTop;
            const triggerPoint = 1200;

            setShowButton(scrollPosition > triggerPoint);
        };

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [scrollRef]);

    const scrollToTop = () => {
        if (scrollRef?.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (!showButton) return null;

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-10 z-10 cursor-pointer bg-black text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition"
                    title="Scroll to top"
                >
                    <FaArrowUp size={15} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ScrollToTopButton;
