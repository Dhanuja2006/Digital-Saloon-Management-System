import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
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
// import bookingRoutes from "./modules/booking/routes/booking.routes.js";

const app = express();

// Security Middleware
app.use(helmet());



// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/users", customerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

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
