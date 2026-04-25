import Review from "../models/Review.js";
import Salon from "../../salon/models/Salon.js";

class ReviewController {
    async createReview(req, res) {
        try {
            const { salonId, bookingId, rating, comment } = req.body;
            const customerId = req.user.id;

            // 1. Validation (Example: In real app, check if booking is completed)
            // const booking = await Booking.findById(bookingId);
            // if (!booking || booking.status !== 'Completed') throw Error...

            // 2. Create Review
            const review = await Review.create({
                salonId,
                customerId,
                bookingId,
                rating,
                comment,
            });

            // 3. Update Salon Average Rating
            const reviews = await Review.find({ salonId, isDeleted: false });
            const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            await Salon.findByIdAndUpdate(salonId, {
                rating: avgRating.toFixed(1),
                totalReviews: reviews.length,
            });

            res.status(201).json({ success: true, data: review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getSalonReviews(req, res) {
        try {
            const reviews = await Review.find({ salonId: req.params.salonId, isDeleted: false })
                .populate("customerId", "fullName profileImage")
                .sort("-createdAt");
            res.status(200).json({ success: true, count: reviews.length, data: reviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const review = await Review.findById(req.params.id);
            if (!review || review.customerId.toString() !== req.user.id) {
                return res.status(403).json({ message: "Not authorized" });
            }

            // Limit edit to 24 hours
            const hoursSinceCreation = (new Date() - review.createdAt) / (1000 * 60 * 60);
            if (hoursSinceCreation > 24) {
                return res.status(400).json({ message: "Reviews can only be edited within 24 hours" });
            }

            const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({ success: true, data: updatedReview });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const review = await Review.findById(req.params.id);
            if (!review || (review.customerId.toString() !== req.user.id && req.user.role !== 'Admin')) {
                return res.status(403).json({ message: "Not authorized" });
            }

            await Review.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.status(200).json({ success: true, message: "Review deleted (soft delete)" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new ReviewController();
