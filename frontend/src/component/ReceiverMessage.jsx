import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dp from '../assets/dp.jpg'; // Adjust path if your default image is located elsewhere

const ReceiverMessage = ({ message, image }) => {
    // Fetch selectedUser from Redux to display the receiver's profile picture
    const { selectedUser } = useSelector((state) => state.user);
    const scroll = useRef();

    // Auto-scroll to this message when it mounts/updates
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message, image]);

    // Handle scroll specifically for when an attached image finishes loading
    const handleImageScroll = () => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div ref={scroll} className="flex justify-start w-full mt-2">
            <div className="flex gap-2 max-w-[80%] sm:max-w-[600px] items-start">
                
                {/* Receiver Profile Picture (Moved to the LEFT) */}
                <div className="w-[40px] h-[40px] shrink-0 mt-1">
                    <img 
                        src={selectedUser?.image || dp} 
                        alt="receiver profile" 
                        className="w-full h-full rounded-full object-cover shadow-sm border border-gray-300"
                    />
                </div>

                {/* Message Content Bubble */}
                <div className="flex flex-col items-start gap-2">
                    
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
                        <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-md w-fit transition-colors duration-300">
                            <span className="text-md break-words">{message}</span>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default ReceiverMessage;