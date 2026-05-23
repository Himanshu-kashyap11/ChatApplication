// messageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg._id !== action.payload);
    },
  },
});

export const { setMessages, addMessage, clearMessages, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;