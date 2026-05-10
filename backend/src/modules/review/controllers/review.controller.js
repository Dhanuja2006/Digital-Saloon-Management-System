import Review from "../models/Review.js";
import Booking from "../../booking/models/Booking.js";

class ReviewController {
    async createReview(req, res, next) {
        try {
            const { salonId, bookingId, rating, comment } = req.body;
            console.log("Create Review Attempt:", { salonId, bookingId, rating, comment, userId: req.user?._id });
            
            // Verify booking exists and belongs to user
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                console.log("Booking not found:", bookingId);
                return res.status(404).json({ message: "Booking not found" });
            }

            if (booking.user.toString() !== req.user._id.toString()) {
                console.log("User mismatch:", { bookingUser: booking.user, reqUser: req.user._id });
                return res.status(403).json({ message: "You can only review your own bookings" });
            }

            if (booking.status !== "Completed") {
                console.log("Booking not completed status:", booking.status);
                return res.status(400).json({ message: "You can only review completed appointments" });
            }

            const review = await Review.create({
                userId: req.user._id,
                salonId,
                bookingId,
                rating,
                comment
            });

            res.status(201).json({ success: true, data: review });
        } catch (error) {
            console.error("Create Review Error:", error);
            if (error.code === 11000) return res.status(400).json({ message: "You have already reviewed this booking" });
            next(error);
        }
    }

    async getSalonReviews(req, res, next) {
        try {
            const reviews = await Review.find({ salonId: req.params.salonId })
                .populate("userId", "fullName profileImage")
                .sort("-createdAt");
            res.status(200).json({ success: true, data: reviews });
        } catch (error) {
            next(error);
        }
    }

    async getAllReviews(req, res, next) {
        try {
            const reviews = await Review.find()
                .populate("userId", "fullName")
                .populate("salonId", "salonName")
                .sort("-createdAt");
            res.status(200).json({ success: true, data: reviews });
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req, res, next) {
        try {
            await Review.findByIdAndDelete(req.params.id);
            res.status(200).json({ success: true, message: "Review deleted" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReviewController();
