import salonRepository from "../repositories/salon.repository.js";
import Booking from "../../booking/models/Booking.js";
import { bucket } from "../../../config/db.js";
import mongoose from "mongoose";
import path from "path";

class SalonService {
    async createSalon(owner, salonData) {
        const ownerId = owner._id || owner.id;
        // Check for existing salon with same name and address for this owner
        const existingSalon = await salonRepository.findOne({
            ownerId,
            salonName: salonData.salonName,
            address: salonData.address,
        });

        if (existingSalon) {
            throw { status: 400, message: "You already have a salon registered with this name and address." };
        }

        const newSalon = await salonRepository.create({
            ...salonData,
            ownerId,
            email: salonData.email || owner.email,
            status: "pending", // Enforce pending status on creation
        });

        return newSalon;
    }

    async getSalonById(id) {
        const salon = await salonRepository.findById(id);
        if (!salon || !salon.isActive) {
            throw { status: 404, message: "Salon not found or has been deactivated" };
        }
        return salon;
    }

    async getMySalons(ownerId) {
        return await salonRepository.findAll({ ownerId, isActive: true });
    }

    async getSalons(filters = {}) {
        const query = { isActive: true, status: "approved" };

        if (filters.city) {
            query.city = { $regex: new RegExp(filters.city, "i") };
        }

        return await salonRepository.findAll(query);
    }

    async updateSalon(id, ownerId, updateData) {
        const salon = await this.getSalonById(id);

        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to update this salon" };
        }

        // Prevent updating critical fields directly
        delete updateData.status;
        delete updateData.totalBookings;
        delete updateData.totalRevenue;
        delete updateData.ownerId;

        return await salonRepository.update(id, updateData);
    }

    async deleteSalon(id, ownerId) {
        const salon = await this.getSalonById(id);

        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to delete this salon" };
        }

        return await salonRepository.delete(id);
    }

    // Admin Methods
    async getPendingSalons() {
        return await salonRepository.findAll({ status: "pending" });
    }

    async updateSalonStatus(id, status) {
        if (!["pending", "approved", "suspended"].includes(status)) {
            throw { status: 400, message: "Invalid status value" };
        }
        return await salonRepository.update(id, { status });
    }

    async addSalonImages(id, ownerId, images) {
        const salon = await this.getSalonById(id);
        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to update this salon" };
        }

        return await salonRepository.update(id, {
            $push: { images: { $each: images } }
        });
    }

    async removeSalonImage(id, ownerId, imagePath) {
        const salon = await this.getSalonById(id);
        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to update this salon" };
        }

        // Remove from DB
        const updatedSalon = await salonRepository.update(id, {
            $pull: { images: imagePath }
        });

        // Try to remove from GridFS
        try {
            const fileId = imagePath.split("/").pop();
            if (fileId && mongoose.Types.ObjectId.isValid(fileId)) {
                await bucket.delete(new mongoose.Types.ObjectId(fileId));
            }
        } catch (err) {
            console.error("Failed to delete image from GridFS:", err);
            // Don't throw error if GridFS delete fails, as DB is already updated
        }

        return updatedSalon;
    }

    async getSalonAnalytics(id, ownerId) {
        const salon = await this.getSalonById(id);
        if (salon.ownerId._id.toString() !== ownerId.toString()) {
            throw { status: 403, message: "Not authorized to view analytics for this salon" };
        }

        const totalBookings = await Booking.countDocuments({ salon: id });
        const confirmedBookings = await Booking.countDocuments({ salon: id, status: "Confirmed" });
        const completedBookings = await Booking.countDocuments({ salon: id, status: "Completed" });
        const cancelledBookings = await Booking.countDocuments({ salon: id, status: "Cancelled" });

        const revenueData = await Booking.aggregate([
            { $match: { salon: salon._id, status: "Completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Get bookings by service
        const serviceStats = await Booking.aggregate([
            { $match: { salon: salon._id } },
            {
                $group: {
                    _id: "$service",
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "services",
                    localField: "_id",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $project: {
                    name: "$serviceDetails.name",
                    count: 1,
                    revenue: 1
                }
            }
        ]);

        // Recent Bookings
        const recentBookings = await Booking.find({ salon: id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "fullName email")
            .populate("service", "name price");

        return {
            stats: {
                totalBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                totalRevenue
            },
            serviceStats,
            recentBookings
        };
    }
}

export default new SalonService();
