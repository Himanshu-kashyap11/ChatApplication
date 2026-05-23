import http from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
let app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});
const userSocketMap = {};
export const getReceiverSocketId = (receiver) => {
    return userSocketMap[receiver]
}
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId != undefined) {
    userSocketMap[userId] = socket.id;

    console.log(userId, socket.id);
  }
  // Always emit a single consistent event name.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing indicator: forward to the intended receiver only.
  socket.on("typing", ({ to }) => {
    if (!userId || !to) return;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from: userId });
    }
  });

  socket.on("stopTyping", ({ to }) => {
    if (!userId || !to) return;
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { from: userId });
    }
  });

  socket.on("disconnect", () => {
    if (userId != undefined) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
