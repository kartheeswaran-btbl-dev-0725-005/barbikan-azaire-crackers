import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    methods: [],
};

const paymentSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        addPaymentMethod: {
            reducer: (state, action) => {
                state.methods.push(action.payload);
            },
            prepare: (type, values) => {
                return {
                    payload: {
                        id: nanoid(),
                        type,
                        values,
                        createAt: Date.now(),
                    },
                };
            },
        },
        updatePaymentMethod: (state, action) => {
            const { id, values } = action.payload;
            const index = state.methods.findIndex(method => method.id === id);
            if (index !== -1) {
                state.methods[index] = { ...state.methods[index], ...values };
            }
        },
        removePaymentMethod: (state, action) => {
            const id = action.payload;
            state.methods = state.methods.filter(method => method.id !== id);
        },
    },
});

export const { addPaymentMethod, updatePaymentMethod, removePaymentMethod } = paymentSlice.actions;

export default paymentSlice.reducer;