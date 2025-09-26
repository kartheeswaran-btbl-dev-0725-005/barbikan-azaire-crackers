import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setLimit } from "@/app/slices/paginationSlice";

export function usePagination(id, totalItems = 0) {
    const dispatch = useDispatch();
    // ensure defaults if state[id] doesn't exist
    const paginationState =
        useSelector((state) => state.pagination[id]) || { page: 1, limit: 10 };
    const { page: currentPage, limit: rowsPerPage } = paginationState;
    const scrollRef = useRef(null);
    // safe totalPages (minimum 1)
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
    const handlePageChange = (pageNumber) => {
        dispatch(setPage({ id, page: pageNumber }));
        if (scrollRef.current)
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
    };
    const handleLimitChange = (newLimit) => {
        dispatch(setLimit({ id, limit: newLimit }));
        if (scrollRef.current)
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
    };
    return {
        currentPage,
        rowsPerPage,
        totalPages,
        handlePageChange,
        handleLimitChange,
        scrollRef,
    };
}