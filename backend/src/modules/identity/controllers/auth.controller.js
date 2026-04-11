import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import {
    generateTokens,
    generateOTP,
    verifyOTP,
    storeRefreshToken,
    removeRefreshToken,
    getStoredRefreshToken,
} from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { ENV } from "../../../config/env.js";
import { sendEmail } from "../../../utils/email.js";


const logAudit = async (userId, action, status, req, details = {}) => {
    try {
        await AuditLog.create({
            userId,
            action,
            status,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            details,
        });
    } catch (error) {
        console.error("Audit Logging Failed:", error);
    }
};

export const signup = async (req, res) => {
    try {
        const { fullName, email, phone, password, role, adminCode } = req.body;

        if (role === "Admin") {
            const secretAdminCode = process.env.ADMIN_CODE || "1234";
            if (adminCode !== secretAdminCode) {
                return res.status(403).json({ message: "Invalid Admin Code" });
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }


        const userStatus = role === "Salon Owner" ? "Pending" : "Active";

        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            role: role || "Customer",
            status: userStatus,
        });

        res.status(201).json({
            message: role === "Salon Owner" 
                ? "Registration successful. Please wait for Admin approval." 
                : "User registered successfully.",
            userId: user._id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            await logAudit(null, "LOGIN_ATTEMPT", "FAILURE", req, { email });
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.status === "Suspended") {
            return res.status(403).json({ message: "Account is suspended" });
        }

        if (user.status === "Pending") {
            return res.status(403).json({ message: "Your account is awaiting admin approval" });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }



        const { accessToken, refreshToken } = generateTokens(user._id, user.role);
        await storeRefreshToken(user._id, refreshToken);

        await logAudit(user._id, "LOGIN_ATTEMPT", "SUCCESS", req);

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: ENV.NODE_ENV === "production" });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {


    try {
        const userId = req.user._id;
        await removeRefreshToken(userId);
        await logAudit(userId, "LOGOUT", "SUCCESS", req);

        res.clearCookie("accessToken");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

        const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET);
        const storedToken = await getStoredRefreshToken(decoded.id);

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        const tokens = generateTokens(user._id, user.role);
        await storeRefreshToken(user._id, tokens.refreshToken);

        res.status(200).json(tokens);
    } catch (error) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = await generateOTP(user._id, "password_reset");

        await sendEmail(email, "HSM Password Reset", `Your password reset code is: ${otp}`);

        await logAudit(user._id, "PASSWORD_RESET_REQUEST", "SUCCESS", req);

        res.status(200).json({ message: "Reset OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isValid = await verifyOTP(user._id, otp, "password_reset");
        if (!isValid) {
            await logAudit(user._id, "PASSWORD_RESET_VERIFY", "FAILURE", req);
            return res.status(401).json({ message: "Invalid or expired OTP" });
        }

        user.password = newPassword;
        await user.save();

        await logAudit(user._id, "PASSWORD_RESET_VERIFY", "SUCCESS", req);
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const requestEmailVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = await generateOTP(user._id, "email_verification");
        
        await sendEmail(email, "HSM Email Verification", `Your verification code is: ${otp}`);

        res.status(200).json({ message: "Verification OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isValid = await verifyOTP(user._id, otp, "email_verification");
        if (!isValid) return res.status(401).json({ message: "Invalid or expired OTP" });

        user.isEmailVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

