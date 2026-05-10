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
            required: [true, "Service name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Service category is required"],
            enum: {
                values: ["Haircut", "Coloring", "Facial", "Styling", "Spa", "Other"],
                message: "{VALUE} is not a valid category"
            }
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        priceType: {
            type: String,
            enum: ["fixed", "starting_from"],
            default: "fixed",
        },
        duration: {
            type: Number, // duration in minutes
            required: [true, "Duration is required"],
            min: [1, "Duration must be at least 1 minute"],
        },
        isActive: {
            type: Boolean, // For soft delete to preserve booking history
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
