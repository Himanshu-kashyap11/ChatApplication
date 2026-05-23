import { useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { serverUrl } from "../main";
import { getId, appendUnique } from "../utils/messageUtils";

export default function GetMessages() {
  const dispatch = useDispatch();
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const messages = useSelector((state) => state.message.messages);
  const normalizedMessages = useMemo(
    () => (Array.isArray(messages) ? messages : []),
    [messages]
  );

  const selectedUserId = useMemo(() => getId(selectedUser), [selectedUser]);
  const myUserId = useMemo(() => getId(userData), [userData]);

  const messagesRef = useRef(normalizedMessages);
  useEffect(() => {
    messagesRef.current = normalizedMessages;
  }, [normalizedMessages]);

  // Fetch conversation messages when selected user changes.
  useEffect(() => {
    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        if (!selectedUserId) {
          dispatch(setMessages([]));
          return;
        }

        const result = await axios.get(`${serverUrl}/api/message/get/${selectedUserId}`, {
          withCredentials: true,
          signal: controller.signal,
        });

        const list = Array.isArray(result.data) ? result.data : [];
        dispatch(setMessages(list));
      } catch (error) {
        // Ignore cancellations; log real errors.
        if (controller.signal.aborted) return;
        console.log("Fetch Messages Error:", error);
      }
    };

    fetchMessages();
    return () => controller.abort();
  }, [selectedUserId, dispatch]);

  // Real-time: attach a single listener with cleanup + dedupe + conversation filtering.
  useEffect(() => {
    if (!socket) return;
    if (!selectedUserId || !myUserId) return;

    const onNewMessage = (newMessage) => {
      const senderId = getId(newMessage?.sender);
      const receiverId = getId(newMessage?.receiver);

      const belongsToOpenChat =
        (senderId === myUserId && receiverId === selectedUserId) ||
        (senderId === selectedUserId && receiverId === myUserId);

      if (!belongsToOpenChat) return;

      const next = appendUnique(messagesRef.current || [], newMessage);
      if (next !== messagesRef.current) {
        messagesRef.current = next;
        dispatch(setMessages(next));
      }
    };

    const onMessageDeleted = (deletedId) => {
      if (!deletedId) return;
      const filtered = messagesRef.current.filter((m) => getId(m?._id) !== deletedId);
      if (filtered.length !== messagesRef.current.length) {
        messagesRef.current = filtered;
        dispatch(setMessages(filtered));
      }
    };

    socket.off("newMessage", onNewMessage);
    socket.on("newMessage", onNewMessage);
    
    socket.off("messageDeleted", onMessageDeleted);
    socket.on("messageDeleted", onMessageDeleted);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messageDeleted", onMessageDeleted);
    };
  }, [socket, selectedUserId, myUserId, dispatch]);

  return null;
}