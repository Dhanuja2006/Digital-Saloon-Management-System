import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { ENV } from "../../../config/env.js";

export const getAllSalons = async (req, res) => {
    try {
        const salons = await User.find({ role: "Salon Owner" });
        res.status(200).json(salons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSalonStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminCode } = req.body; // Active, Suspended

        const secretAdminCode = ENV.ADMIN_CODE || "1234";
        if (adminCode !== secretAdminCode) {
            return res.status(403).json({ message: "Invalid Admin Code" });
        }

        if (!["Active", "Suspended"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }


        const user = await User.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        if (!user) return res.status(404).json({ message: "Salon owner not found" });

        // Log the action
        await AuditLog.create({
            userId: req.user._id,
            action: `SALON_${status.toUpperCase()}`,
            status: "SUCCESS",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            details: { targetUserId: id },
        });

        res.status(200).json({ message: `Salon status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPendingSalons = async (req, res) => {
    try {
        const pendingSalons = await User.find({ role: "Salon Owner", status: "Pending" });
        res.status(200).json(pendingSalons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ["Customer", "Salon Owner"] } })
            .select("-password")
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body; 

        if (typeof isBlocked !== 'boolean') {
            return res.status(400).json({ message: "Invalid status" });
        }

        const user = await User.findByIdAndUpdate(id, { isBlocked }, { returnDocument: 'after' }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        await AuditLog.create({
            userId: req.user._id,
            action: isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
            status: "SUCCESS",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            details: { targetUserId: id },
        });

        res.status(200).json({ message: `User access updated`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
