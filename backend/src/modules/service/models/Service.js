import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        salonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Haircut", "Coloring", "Facial", "Styling", "Spa", "Other"], // Basic categories, can be expanded
        },
        price: {
            type: Number,
            required: true,
        },
        priceType: {
            type: String,
            enum: ["fixed", "starting_from"],
            default: "fixed",
        },
        duration: {
            type: Number, // duration in minutes
            required: true,
        },
        isActive: {
            type: Boolean, // For soft delete to preserve booking history
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
