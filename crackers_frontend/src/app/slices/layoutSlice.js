import { createSlice } from "@reduxjs/toolkit";

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        selectedItem: "Analytics",
        inputs: {},
    },
    reducers: {
        setSelectedItem: (state, action) => {
            state.selectedItem = action.payload;
        },
        setInput: (state, action) => {
            const { key, value } = action.payload;
            state.inputs[key] = value;
        }
    },
});

export const { setSelectedItem, setInput } = layoutSlice.actions;

export default layoutSlice.reducer;
