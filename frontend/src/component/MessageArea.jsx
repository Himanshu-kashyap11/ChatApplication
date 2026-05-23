import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';

// Icons (Adjust these imports based on the exact react-icons you chose)
import { IoMdArrowBack } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { FaImage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

import { setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { serverUrl } from '../main';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import dp from '../assets/3d.png';
import { useTheme } from '../context/useTheme';
import { getId, getMessageKey, appendUnique } from '../utils/messageUtils';

const MessageArea = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    
    // Redux States
    const { userData, selectedUser, socket, onlineUsers } = useSelector((state) => state.user);
    const messages = useSelector((state) => state.message.messages) || [];
    const myUserId = useMemo(() => getId(userData), [userData]);
    const selectedUserId = useMemo(() => getId(selectedUser), [selectedUser]);
    const isSelectedUserOnline = useMemo(() => {
        if (!selectedUserId) return false;
        return Array.isArray(onlineUsers) && onlineUsers.includes(selectedUserId);
    }, [onlineUsers, selectedUserId]);

    // Local States
    const [input, setInput] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [frontEndImage, setFrontEndImage] = useState(null); // For preview
    const [backEndImage, setBackEndImage] = useState(null);   // For sending to backend
    const [isTyping, setIsTyping] = useState(false);
    
    const imageRef = useRef();
    const typingTimeoutRef = useRef(null);

    // ---------------------------------------------------------
    // IMAGE PREVIEW URL CLEANUP
    // ---------------------------------------------------------
    useEffect(() => {
        // When using URL.createObjectURL, we must revoke it to avoid memory leaks.
        return () => {
            if (frontEndImage?.startsWith("blob:")) {
                URL.revokeObjectURL(frontEndImage);
            }
        };
    }, [frontEndImage]);

    // ---------------------------------------------------------
    // TYPING INDICATOR (REAL-TIME)
    // ---------------------------------------------------------
    useEffect(() => {
        if (!socket || !selectedUserId) return;

        const onTyping = ({ from }) => {
            if (from === selectedUserId) setIsTyping(true);
        };
        const onStopTyping = ({ from }) => {
            if (from === selectedUserId) setIsTyping(false);
        };

        socket.off("typing", onTyping);
        socket.off("stopTyping", onStopTyping);
        socket.on("typing", onTyping);
        socket.on("stopTyping", onStopTyping);

        return () => {
            socket.off("typing", onTyping);
            socket.off("stopTyping", onStopTyping);
        };
    }, [socket, selectedUserId]);

    // ---------------------------------------------------------
    // HANDLERS
    // ---------------------------------------------------------
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackEndImage(file);
            const url = URL.createObjectURL(file);
            setFrontEndImage(url);
        }
    };

    const onEmojiClick = (emojiData) => {
        setInput((prev) => prev + emojiData.emoji);
        setShowPicker(false);
    };

    const emitTyping = (value) => {
        if (!socket || !selectedUserId) return;

        // If there is content, user is typing; otherwise stop.
        if (value.trim().length > 0) {
            socket.emit("typing", { to: selectedUserId });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", { to: selectedUserId });
            }, 900);
        } else {
            socket.emit("stopTyping", { to: selectedUserId });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Prevent sending empty messages
        if (input.trim().length === 0 && !backEndImage) return;
        if (!selectedUserId) return;

        try {
            // Stop typing immediately on send
            if (socket && selectedUserId) socket.emit("stopTyping", { to: selectedUserId });
            const formData = new FormData();
            formData.append("message", input);
            if (backEndImage) {
                formData.append("image", backEndImage);
            }

            const result = await axios.post(
                `${serverUrl}/api/message/send/${selectedUserId}`,
                formData,
                { withCredentials: true }
            );

            // Update Redux state with the newly sent message
            const next = appendUnique(messages || [], result.data);
            dispatch(setMessages(next));

            // Clear inputs after sending
            setInput("");
            if (frontEndImage?.startsWith("blob:")) URL.revokeObjectURL(frontEndImage);
            setFrontEndImage(null);
            setBackEndImage(null);

        } catch (error) {
            console.log("Send Message Error:", error);
        }
    };

    // ---------------------------------------------------------
    // CONDITIONAL RENDERING (WELCOME SCREEN)
    // ---------------------------------------------------------
    if (!selectedUser) {
        return (
            <div className="hidden lg:flex w-[70%] h-full bg-slate-300 dark:bg-gray-800 flex-col items-center justify-center transition-colors duration-300">
                <h1 className="text-5xl font-bold text-gray-700 dark:text-gray-200">Welcome to Chatly</h1>
                <span className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mt-2">Chat Friendly!</span>
            </div>
        );
    }

    // ---------------------------------------------------------
    // MAIN CHAT AREA
    // ---------------------------------------------------------
    return (
        <div className="flex w-full lg:w-[70%] h-full bg-slate-300 dark:bg-gray-800 flex-col relative transition-colors duration-300">
            
            {/* Header */}
            <div className="flex items-center gap-5 w-full h-[100px] bg-slate-400 dark:bg-slate-700 px-5 shadow-md transition-colors duration-300">
                <IoMdArrowBack 
                    className="text-4xl text-white cursor-pointer" 
                    onClick={() => dispatch(setSelectedUser(null))} 
                />
                <img 
                    src={selectedUser.image || dp} 
                    alt="profile" 
                    className="w-[50px] h-[50px] rounded-full object-cover shadow-md"
                />
                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-white leading-tight">
                        {selectedUser.name || "User"}
                    </h1>
                    <span className="text-sm text-white/90">
                        {isTyping ? "typing..." : isSelectedUserOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 w-full overflow-y-auto flex flex-col gap-3 px-5 py-[20px] pb-[80px]">
                {Array.isArray(messages) && messages.map((msg) => {
                    const key = getMessageKey(msg);
                    // Check if the current logged-in user is the sender
                    const senderId = getId(msg?.sender);
                    if (senderId && myUserId && senderId === myUserId) {
                        return (
                            <SenderMessage 
                                key={key} 
                                id={msg?._id}
                                message={msg?.message} 
                                image={msg?.image} 
                            />
                        );
                    } else {
                        return (
                            <ReceiverMessage 
                                key={key} 
                                message={msg?.message} 
                                image={msg?.image} 
                            />
                        );
                    }
                })}
            </div>

            {/* Image Preview Window (Appears above input when an image is selected) */}
            {frontEndImage && (
                <div className="absolute bottom-[100px] right-[20%] z-50">
                    <img 
                        src={frontEndImage} 
                        alt="preview" 
                        className="w-[150px] rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Emoji Picker */}
            {showPicker && (
                <div className="absolute bottom-[120px] left-[20px] z-[100] shadow-lg">
                    <EmojiPicker 
                        onEmojiClick={onEmojiClick} 
                        width={250} 
                        height={350} 
                        theme={theme === 'dark' ? 'dark' : 'light'}
                    />
                </div>
            )}

            {/* Input Form */}
            <div className="absolute bottom-5 w-full flex justify-center px-5">
                <form 
                    onSubmit={handleSendMessage} 
                    className="flex items-center gap-3 w-full lg:w-[90%] max-w-[800px] bg-slate-200 dark:bg-gray-700 h-[60px] px-5 rounded-full shadow-lg transition-colors duration-300"
                >
                    {/* Emoji Trigger */}
                    <div onClick={() => setShowPicker((prev) => !prev)}>
                        <BsEmojiSmile className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer" />
                    </div>

                    {/* Image Upload Trigger */}
                    <div onClick={() => imageRef.current.click()}>
                        <FaImage className="text-2xl text-gray-600 dark:text-gray-300 cursor-pointer" />
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={imageRef} 
                        onChange={handleImage} 
                    />

                    {/* Text Input */}
                    <input 
                        type="text" 
                        placeholder="Message" 
                        value={input} 
                        onChange={(e) => {
                            const val = e.target.value;
                            setInput(val);
                            emitTyping(val);
                        }} 
                        onBlur={() => {
                            if (socket && selectedUserId) socket.emit("stopTyping", { to: selectedUserId });
                            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                        }}
                        className="w-full h-full bg-transparent outline-none text-lg px-2 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    {/* Send Butt-on (Only shows if there's text or an image) */}
                    {(input.trim().length > 0 || backEndImage) && (
                        <button type="submit" className="ml-2">
                            <IoSend className="text-2xl text-blue-500 cursor-pointer" />
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MessageArea;