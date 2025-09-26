import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slices/layoutSlice';
import paymentReducer from './slices/paymentSlice';
import storeReducer from './slices/storeSlice';
import paginationReducer from "./slices/paginationSlice";

export const store = configureStore({
	reducer: {
		layout: layoutReducer,
		payments: paymentReducer,
		store: storeReducer,
		pagination: paginationReducer,
	},
});
