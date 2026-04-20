import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
    {
        salonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        date: {
            type: Date, // Storing as YYYY-MM-DD
            required: true,
        },
        startTime: {
            type: String, // HH:MM
            required: true,
        },
        endTime: {
            type: String, // HH:MM
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            default: 1, // Number of simultaneous bookings possible for this slot
        },
        bookingsCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["available", "reserved", "full", "blocked"],
            default: "available",
        },
        lockExpiresAt: {
            type: Date, // For lock mechanism (e.g., locking slot for 5 mins during checkout)
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes to speed up queries and prevent duplicates
slotSchema.index({ salonId: 1, serviceId: 1, date: 1, startTime: 1 }, { unique: true });
slotSchema.index({ lockExpiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic expiry (optional usage)

export default mongoose.model("Slot", slotSchema);
