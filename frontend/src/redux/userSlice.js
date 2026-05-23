import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        otherUsers: [],
        selectedUser: null,
        socket: null,
        onlineUsers: [],
        authChecked: false,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload ?? [];
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
        },
        setAuthChecked: (state, action) => {
            state.authChecked = Boolean(action.payload);
        }
    }
});

export const { 
    setUserData, 
    setOtherUsers, 
    setSelectedUser, 
    setSocket, 
    setOnlineUsers,
    setAuthChecked
} = userSlice.actions;

export default userSlice.reducer;