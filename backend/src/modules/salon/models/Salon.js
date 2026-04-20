import mongoose from "mongoose";

const salonSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salonName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        images: [
            {
                type: String,
            },
        ],
        workingHours: {
            monday: { open: String, close: String },
            tuesday: { open: String, close: String },
            wednesday: { open: String, close: String },
            thursday: { open: String, close: String },
            friday: { open: String, close: String },
            saturday: { open: String, close: String },
            sunday: { open: String, close: String },
        },
        status: {
            type: String,
            enum: ["pending", "approved", "suspended"],
            default: "pending",
        },
        rating: {
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        totalBookings: {
            type: Number,
            default: 0,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes to speed up searches and prevent duplicates
salonSchema.index({ ownerId: 1, salonName: 1, address: 1 }, { unique: true });
salonSchema.index({ status: 1 });
salonSchema.index({ city: 1 });

export default mongoose.model("Salon", salonSchema);
