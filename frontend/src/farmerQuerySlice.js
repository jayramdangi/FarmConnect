// farmerQuerySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatHistory: [{
    role: 'model',
    parts: [{ text: 'Welcome to the Agricultural Query System! How can I help you with your yield and mandi information today?', type: 'text' }]
  }],
  toolResults: [] // Changed from toolResult to toolResults (array)
};

export const farmerQuerySlice = createSlice({
  name: 'farmerQuery',
  initialState,
  reducers: {
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    addMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    addToolResult: (state, action) => { // Changed from setToolResult to addToolResult
      state.toolResults.push(action.payload);
    },
    clearState: (state) => {
      state.chatHistory = [{
        role: 'model',
        parts: [{ text: 'Welcome to the Agricultural Query System! How can I help you with your yield and mandi information today?', type: 'text' }]
      }];
      state.toolResults = []; // Clear the array
    }
  }
});

export const { setChatHistory, addMessage, addToolResult, clearState } = farmerQuerySlice.actions;
export default farmerQuerySlice.reducer;