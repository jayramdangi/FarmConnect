// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../authSlice';
import themeReducer from '../themeSlice';
import farmerQueryReducer from '../farmerQuerySlice'; // Import the new slice

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        farmerQuery: farmerQueryReducer, // Add the new reducer
    }
});