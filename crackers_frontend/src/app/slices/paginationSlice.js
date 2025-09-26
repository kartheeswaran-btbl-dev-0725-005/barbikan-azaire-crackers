import { createSlice } from "@reduxjs/toolkit";
const initialState = {}; // each table will have its own pagination state

const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPage: (state, action) => {
            const { id, page } = action.payload;
            if (!state[id]) state[id] = { page: 1, limit: 10 };
            state[id].page = page;
        },
        setLimit: (state, action) => {
            const { id, limit } = action.payload;
            if (!state[id]) state[id] = { page: 1, limit: 10 };
            state[id].limit = limit;
            state[id].page = 1; // reset page when limit changes
        },
        resetPagination: (state, action) => {
            const { id } = action.payload || {};
            if (id) {
                delete state[id]; // reset only one table
            } else {
                return {}; // reset all tables with a new object
            }
        },
    },
});

export const { setPage, setLimit, resetPagination } = paginationSlice.actions;
export default paginationSlice.reducer;