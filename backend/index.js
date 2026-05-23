import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

// ✅ UPDATED: Changed the fallback port to 8001 to avoid the 8000 clash
const port = process.env.PORT || 8001;

// Middleware
app.use(cors({
    // Make sure this matches your FRONTEND URL. 
    // If your frontend runs on Vite, it might be http://localhost:5173
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // ✅ FIXED

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// Server
server.listen(port, async () => {
    await connectDb();
    console.log(`Server started on port ${port}`);
});