import mongoose from "mongoose";
import { ENV } from "./env.js";

let bucket;

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB with URI:", ENV.MONGO_URI);
        await mongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB Connected");

        const db = mongoose.connection.db;
        bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: "salons",
        });
    } catch (error) {
        console.error("Database connection failed details:", {
            message: error.message,
            code: error.code,
            hostname: error.hostname,
            stack: error.stack
        });
        process.exit(1);
    }
};

export { bucket };
export default connectDB;
