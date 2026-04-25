import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["Customer", "Salon Owner", "Admin"],
            default: "Customer",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["Active", "Suspended", "Pending"],
            default: "Active",
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String,
        },
        // Customer Profile Fields
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        dateOfBirth: {
            type: Date,
        },
        preferences: {
            hairType: String,
            stylePreference: String,
        },
        // Salon Owner Profile Fields
        salonName: {
            type: String,
            trim: true,
        },
        salonAddress: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        workingHours: {
            open: { type: String },
            close: { type: String },
        },

        refreshToken: {
            type: String,
            select: false,
        },
        // Customer Behavioral Data
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Salon",
            },
        ],
        recentlyViewed: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Salon",
            },
        ],
        loyaltyPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
