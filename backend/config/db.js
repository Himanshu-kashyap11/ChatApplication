import mongoose from "mongoose";
import dns from "node:dns/promises";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDb = async () =>{
    try {
       await mongoose.connect("mongodb+srv://Himanshu:12345@cluster0.mpcbict.mongodb.net/chatapp?retryWrites=true&w=majority");
        console.log("db connected")
    } catch (error) {
        console.log("db error", error.message);
    }
}
export default connectDb