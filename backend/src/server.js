import express from "express";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Database connection and server start
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();
