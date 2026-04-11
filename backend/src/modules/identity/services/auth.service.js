import jwt from "jsonwebtoken";
import { ENV } from "../../../config/env.js";
import otpGenerator from "otp-generator";
import OTP from "../models/OTP.js";
import User from "../models/User.js";

export const generateTokens = (userId, role) => {
    const accessToken = jwt.sign({ id: userId, role }, ENV.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ id: userId, role }, ENV.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
};

export const generateOTP = async (userId, type) => {
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
    });

    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes from now

    // Save OTP to DB
    await OTP.create({
        userId,
        otp,
        type,
        expiresAt,
    });

    return otp;
};

export const verifyOTP = async (userId, otp, type) => {
    const otpRecord = await OTP.findOne({ userId, otp, type });
    if (!otpRecord) return false;

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });
    return true;
};

export const storeRefreshToken = async (userId, token) => {
    // Store in User document
    await User.findByIdAndUpdate(userId, { refreshToken: token });
};

export const removeRefreshToken = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getStoredRefreshToken = async (userId) => {
    const user = await User.findById(userId).select("+refreshToken");
    return user?.refreshToken;
};

