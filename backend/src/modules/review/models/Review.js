import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        salonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Salon",
            required: true,
        },
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

// Update salon rating after review is saved
reviewSchema.post("save", async function () {
    const Salon = mongoose.model("Salon");
    const stats = await mongoose.model("Review").aggregate([
        { $match: { salonId: this.salonId } },
        {
            $group: {
                _id: "$salonId",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Salon.findByIdAndUpdate(this.salonId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].count,
        });
    }

    // Mark booking as reviewed
    await mongoose.model("Booking").findByIdAndUpdate(this.bookingId, { isReviewed: true });
});

export default mongoose.model("Review", reviewSchema);
