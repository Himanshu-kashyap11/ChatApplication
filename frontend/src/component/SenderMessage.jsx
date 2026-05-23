import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { MdDeleteOutline } from 'react-icons/md';
import { serverUrl } from '../main';
import { removeMessage } from '../redux/messageSlice';
import dp from '../assets/dp.jpg'; // Adjust path if your default image is located elsewhere

const SenderMessage = ({ id, message, image }) => {
    // Get current user data to display their profile picture
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const scroll = useRef();

    // Auto-scroll to this message when it mounts/updates
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message, image]);

    // Handle scroll specifically for when an attached image finishes loading
    const handleImageScroll = () => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDelete = async () => {
        if (!id) return;
        const confirmContent = window.confirm("Are you sure you want to delete this message?");
        if (!confirmContent) return;

        setIsDeleting(true);
        try {
            await axios.delete(`${serverUrl}/api/message/${id}`, { withCredentials: true });
            dispatch(removeMessage(id));
        } catch (error) {
            console.error("Failed to delete message:", error);
            setIsDeleting(false); // In case of error revert
        }
    };

    return (
        <div ref={scroll} className={`flex justify-end w-full mt-2 transition-all duration-300 ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex gap-2 max-w-[80%] sm:max-w-[600px] items-start group relative">
                
                {/* Delete Button */}
                <button 
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 mr-1 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300 shadow-sm disabled:opacity-50"
                    title="Delete message"
                    disabled={isDeleting}
                >
                    <MdDeleteOutline className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                </button>

                {/* Message Content Bubble */}
                <div className="flex flex-col items-end gap-2">
                    
                    {/* If an image attachment exists */}
                    {image && (
                        <img 
                            src={image.secure_url || image} 
                            alt="attachment" 
                            className="w-[150px] sm:w-[200px] rounded-lg shadow-md object-cover"
                            onLoad={handleImageScroll} // Crucial for scrolling after image load
                        />
                    )}
                    
                    {/* If a text message exists */}
                    {message && (
                        <div className="bg-[#20c7ff] dark:bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-md w-fit transition-colors duration-300">
                            <span className="text-md break-words">{message}</span>
                        </div>
                    )}
                </div>

                {/* Sender Profile Picture */}
                <div className="w-[40px] h-[40px] shrink-0 mt-1">
                    <img 
                        src={userData?.image || dp} 
                        alt="sender profile" 
                        className="w-full h-full rounded-full object-cover shadow-sm border border-gray-300"
                    />
                </div>
                
            </div>
        </div>
    );
};

export default SenderMessage;