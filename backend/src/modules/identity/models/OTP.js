import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["email_verification", "phone_verification", "password_reset", "login_otp"],
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // Document will be deleted at expiresAt
        },
    },
    {
        timestamps: true,
    }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
