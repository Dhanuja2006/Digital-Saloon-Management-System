import mongoose from "mongoose";
import { ENV } from "./env.js";

let bucket;

const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB Connected");

        const db = mongoose.connection.db;
        bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: "salons",
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export { bucket };
export default connectDB;