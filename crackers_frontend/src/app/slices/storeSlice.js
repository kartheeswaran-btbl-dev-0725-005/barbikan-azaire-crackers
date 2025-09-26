import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    storeSettings: [],
    enableOnlineOrders: false,
};

const storeSlice = createSlice({
    name: "store",
    initialState,
    reducers: {
        addStoreSettings: {
            reducer: (state, action) => {
                state.storeSettings.push(action.payload);
            },
            prepare: (values) => {
                return {
                    payload: {
                        id: nanoid(),
                        values,
                        createdAt: Date.now(),
                    },
                };
            },
        },
        toggleOnlineOrders: (state) => {
            state.enableOnlineOrders = !state.enableOnlineOrders;
        },
    },
});

export const { addStoreSettings, toggleOnlineOrders } = storeSlice.actions;
export default storeSlice.reducer;