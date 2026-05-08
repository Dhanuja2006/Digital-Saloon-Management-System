import Booking from "../models/Booking.js";
import Slot from "../../slot/models/Slot.js";
import Service from "../../service/models/Service.js";
import User from "../../identity/models/User.js";
import Salon from "../../salon/models/Salon.js";
import mongoose from "mongoose";
import { sendEmail } from "../../../utils/email.js";

class BookingService {
    async createBooking(userId, bookingData) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { slotId } = bookingData;
            
            const slot = await Slot.findById(slotId).session(session);
            if (!slot) throw new Error("Slot not found");
            if (slot.status !== "available" || slot.bookingsCount >= slot.capacity) {
                throw new Error("Slot is fully booked or unavailable");
            }

            const service = await Service.findById(slot.serviceId).session(session);
            if (!service) throw new Error("Service not found");

            // Update slot capacity
            slot.bookingsCount += 1;
            if (slot.bookingsCount >= slot.capacity) {
                slot.status = "full";
            }
            await slot.save({ session });

            const booking = await Booking.create([{
                user: userId,
                salon: slot.salonId,
                service: slot.serviceId,
                slot: slot._id,
                totalAmount: service.price,
                status: "Confirmed", // auto confirm for now
                paymentStatus: "Unpaid"
            }], { session });

            await session.commitTransaction();
            session.endSession();

            // Send Confirmation Email (Async)
            const createdBooking = booking[0];
            const user = await User.findById(userId).lean();
            const salon = await Salon.findById(slot.salonId).lean();
            if (user && salon) {
                const emailContent = `Hello ${user.fullName},

Your booking has been confirmed!

Service: ${service.name}
Salon: ${salon.salonName}
Address: ${salon.address}
Date: ${new Date(slot.date).toLocaleDateString()}
Time: ${slot.startTime} - ${slot.endTime}
Total Amount: $${service.price}

Thank you for choosing ${salon.salonName}!`;
                
                sendEmail(user.email, `Booking Confirmed - ${salon.salonName}`, emailContent);
            }

            return createdBooking;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async getMyBookings(userId) {
        return await Booking.find({ user: userId })
            .populate("salon", "salonName address images")
            .populate("service", "name duration price")
            .populate("slot", "date startTime endTime status")
            .sort({ createdAt: -1 })
            .lean();
    }

    async getSalonBookings(salonId, ownerId) {
        // Verify ownership
        const Salon = mongoose.model("Salon");
        const salon = await Salon.findOne({ _id: salonId, ownerId }).lean();
        if (!salon) {
            throw new Error("Unauthorized: You do not own this salon or it doesn't exist.");
        }

        return await Booking.find({ salon: salonId })
            .populate("user", "fullName email phone")
            .populate("service", "name duration")
            .populate("slot", "date startTime endTime status")
            .sort({ createdAt: -1 })
            .lean();
    }

    async updateBookingStatus(bookingId, status) {
        const booking = await Booking.findById(bookingId).populate("service").populate("slot");
        if (!booking) throw new Error("Booking not found");

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Update Salon Stats if completed
        if (status === "Completed" && oldStatus !== "Completed") {
            const Salon = mongoose.model("Salon");
            await Salon.findByIdAndUpdate(booking.salon, {
                $inc: {
                    totalBookings: 1,
                    totalRevenue: booking.totalAmount
                }
            });
        }

        // Send Status Update Email
        const user = await User.findById(booking.user).lean();
        const salon = await Salon.findById(booking.salon).lean();
        if (user && salon) {
            const emailContent = `Hello ${user.fullName},

The status of your booking at ${salon.salonName} has been updated.

New Status: ${status}
Service: ${booking.service?.name || "Service Details"}
Date: ${booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : "Date Details"}

Thank you,
The ${salon.salonName} Team`;

            sendEmail(user.email, `Booking Status Updated - ${salon.salonName}`, emailContent);
        }
        
        return booking;
    }

    async cancelBooking(bookingId, userId) {
        const booking = await Booking.findById(bookingId).populate("slot").populate("service");
        if (!booking) throw new Error("Booking not found");

        if (booking.user.toString() !== userId.toString()) {
            throw new Error("Not authorized to cancel this booking");
        }

        if (booking.status === "Cancelled") throw new Error("Booking is already cancelled");
        if (booking.status === "Completed") throw new Error("Cannot cancel a completed booking");

        const slot = booking.slot;
        const [hours, minutes] = slot.startTime.split(":").map(Number);
        const bookingDateTime = new Date(slot.date);
        bookingDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const diffInMs = bookingDateTime - now;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 7) {
            throw new Error("Bookings can only be cancelled at least 7 hours in advance");
        }

        booking.status = "Cancelled";
        await booking.save();

        // Update slot capacity
        const Slot = mongoose.model("Slot");
        const slotDoc = await Slot.findById(slot._id);
        if (slotDoc) {
            slotDoc.bookingsCount = Math.max(0, slotDoc.bookingsCount - 1);
            if (slotDoc.status === "full" && slotDoc.bookingsCount < slotDoc.capacity) {
                slotDoc.status = "available";
            }
            await slotDoc.save();
        }

        // Send Cancellation Email
        const user = await User.findById(booking.user).lean();
        const salon = await Salon.findById(booking.salon).lean();
        if (user && salon) {
            const emailContent = `Hello ${user.fullName},

Your booking at ${salon.salonName} has been successfully cancelled.

Service: ${booking.service?.name || "Service Details"}
Date: ${booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : "Date Details"}

We hope to see you again soon!

Best regards,
The ${salon.salonName} Team`;

            sendEmail(user.email, `Booking Cancelled - ${salon.salonName}`, emailContent);
        }

        return booking;
    }

    async getAllBookings(filters = {}) {
        const query = {};
        if (filters.status) query.status = filters.status;
        if (filters.salonId) query.salon = filters.salonId;
        if (filters.userId) query.user = filters.userId;

        return await Booking.find(query)
            .populate("user", "fullName email")
            .populate("salon", "salonName")
            .populate("service", "name")
            .populate("slot", "date startTime endTime")
            .sort({ createdAt: -1 })
            .lean();
    }
}

export default new BookingService();
