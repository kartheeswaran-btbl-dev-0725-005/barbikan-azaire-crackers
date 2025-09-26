import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DropDown from "../ui/DropDown";

function Pagination({
    currentPage,
    totalPages,
    rowsPerPage,
    onPageChange,
    onLimitChange,
    customStyle,
    position,
}) {
    const [startPage, setStartPage] = useState(1);
    const windowSize = 3;

    useEffect(() => {
        if (currentPage < startPage) {
            setStartPage(currentPage);
        } else if (currentPage >= startPage + windowSize) {
            setStartPage(currentPage - windowSize + 2);
        }
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const visiblePages = Array.from({ length: windowSize }, (_, i) => startPage + i)
        .filter((p) => p >= 1 && p <= totalPages);

    const lastVisible = visiblePages[visiblePages.length - 1];
    const showTrailingDots = lastVisible < totalPages - 1;


    return (
        <div className={`flex justify-between items-center text-sm ${customStyle}`}>
            <div className="flex items-center justify-center gap-4 text-xs">
                Rows per page:{" "}
                <DropDown
                    value={rowsPerPage}
                    onChange={onLimitChange}
                    options={[10, 25, 50, 100]}
                    position={position}
                />
            </div>

            {
                totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        {/* Previous button */}
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                            <IoIosArrowBack />
                        </button>

                        {/* Sliding window page buttons */}
                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className="cursor-pointer"
                            >
                                <span className={`m-1 ${page === currentPage ? "font-bold border-b border-black" : ""}`}>
                                    {page}
                                </span>
                            </button>
                        ))}

                        {/* Show ... and last page if not already visible */}
                        {showTrailingDots && (
                            <>
                                <span className="px-1">...</span>
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="w-10 cursor-pointer"
                                >
                                    <span className={`m-1 ${currentPage === totalPages ? "font-bold border-b border-black" : ""}`}>
                                        {totalPages}
                                    </span>
                                </button>
                            </>
                        )}

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default Pagination;
