import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";


import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

// Routes Imports
import authRoutes from "./modules/identity/routes/auth.routes.js";
import adminRoutes from "./modules/identity/routes/admin.routes.js";
// import bookingRoutes from "./modules/booking/routes/booking.routes.js";

const app = express();

// Security Middleware
app.use(helmet());



// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Digital Salon Management System API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
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
