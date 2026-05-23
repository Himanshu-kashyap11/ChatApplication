import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

// Components & Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

// Custom Hooks
import GetCurrentUser from "./customHooks/getCurrentUser";
import GetOtherUsers from "./customHooks/getOtherUser";

// Redux Actions
import { setSocket, setOnlineUsers } from './redux/userSlice';
import { serverUrl } from './main';

const App = () => {
    const dispatch = useDispatch();
    const { userData, authChecked } = useSelector((state) => state.user); // Removed socket from here

    // Socket.io Setup
    useEffect(() => {
        if (userData) {
            // Initialize Socket connection
            const socketio = io(serverUrl, {
                query: {
                    userId: userData._id,
                },
            });

            // Store the socket instance in Redux
            dispatch(setSocket(socketio));

            // Listen for online users from the backend
            const onOnlineUsers = (onlineUsers) => {
                dispatch(setOnlineUsers(onlineUsers));
            };
            socketio.on('getOnlineUsers', onOnlineUsers);

            // Cleanup function: This automatically runs when the component unmounts 
            // OR when userData changes (e.g., user logs out).
            return () => {
                socketio.off('getOnlineUsers', onOnlineUsers);
                socketio.close();
                dispatch(setSocket(null));
            };
        }
    }, [userData, dispatch]); // ✅ FIXED: socket is no longer in this array

    return (
        <>
            {/* Bootstrap data safely */}
            <GetCurrentUser />
            <GetOtherUsers />

            {!authChecked ? (
                <div className="w-full h-[100vh] flex items-center justify-center bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
                    <div className="text-gray-700 dark:text-gray-200 text-lg font-semibold">Loading...</div>
                </div>
            ) : (
                <Routes>
                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={userData ? <Home /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/profile" 
                        element={userData ? <Profile /> : <Navigate to="/login" />} 
                    />

                    {/* Public Routes */}
                    <Route 
                        path="/login" 
                        element={!userData ? <Login /> : <Navigate to="/" />} 
                    />
                    <Route 
                        path="/signup" 
                        element={!userData ? <SignUp /> : <Navigate to="/" />} 
                    />
                </Routes>
            )}
        </>
    );
};

export default App;