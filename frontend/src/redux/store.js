import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import messageSlice from "./messageSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        message: messageSlice
    },
    // ✅ FIXED: Added middleware to silence the non-serializable socket warnings
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['user/setSocket'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload'],
                // Ignore these paths in the state
                ignoredPaths: ['user.socket'],
            },
        }),
});