import express from "express";
import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import { nosqlSanitize } from "./middleware/sanitize.middleware.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

// Routes Imports
import authRoutes from "./modules/identity/routes/auth.routes.js";
import adminRoutes from "./modules/identity/routes/admin.routes.js";
import salonRoutes from "./modules/salon/routes/salon.routes.js";
import serviceRoutes from "./modules/service/routes/service.routes.js";
import slotRoutes from "./modules/slot/routes/slot.routes.js";
import customerRoutes from "./modules/customer/routes/customer.routes.js";
import reviewRoutes from "./modules/review/routes/review.routes.js";
import notificationRoutes from "./modules/notification/routes/notification.routes.js";
import bookingRoutes from "./modules/booking/routes/booking.routes.js";

const app = express();

// 🛡️ SECURITY MIDDLEWARE (DAST Optimization)
app.use(helmet({
    crossOriginResourcePolicy: false,
})); // Sets various HTTP headers for security
app.use(nosqlSanitize); // Prevents NoSQL injection (Custom Express 5 compatible)

// 🚀 PERFORMANCE MIDDLEWARE
app.use(compression()); // Compresses response bodies for better performance


// Security Middleware
import cors from "cors";

// Define allowed origins
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5050"
];

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10kb" })); // Body limit to prevent DoS via large JSON
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/users", customerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.send("Digital Salon Management System API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    // Log error for debugging
    if (ENV.NODE_ENV === "development") {
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: `Validation Error: ${messages.join(", ")}`,
        });
    }

    // Mongoose Cast Error (Invalid ID)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        });
    }

    res.status(err.status || 500).json({
        success: false,
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
 
 
