import User from "../../identity/models/User.js";
import Salon from "../../salon/models/Salon.js";

class CustomerController {
    // A. Profile Management
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id).populate("favorites").populate("recentlyViewed");
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const updates = req.body;
            // Prevent sensitive fields update
            const forbidden = ["password", "role", "email", "status", "isBlocked", "isEmailVerified"];
            forbidden.forEach((field) => delete updates[field]);

            const user = await User.findByIdAndUpdate(req.user.id, updates, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({ success: true, message: "Profile updated", data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async uploadProfileImage(req, res) {
        try {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });
            const imagePath = `/uploads/profiles/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(req.user.id, { profileImage: imagePath }, { new: true });
            res.status(200).json({ success: true, profileImage: imagePath, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // B. Salon Discovery
    async browseSalons(req, res) {
        try {
            const { city, service, rating, minPrice, maxPrice, sort } = req.query;
            let query = { status: "approved", isActive: true };

            if (city) query.city = { $regex: city, $options: "i" };
            if (rating) query.rating = { $gte: Number(rating) };

            let salons = await Salon.find(query);

            // Filtering by service (requires looking into Service model)
            // For now, simple discovery. In a real app, we'd join with services.

            res.status(200).json({ success: true, count: salons.length, data: salons });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getSalonDetails(req, res) {
        try {
            const salon = await Salon.findById(req.params.id);
            if (!salon) return res.status(404).json({ message: "Salon not found" });

            // Add to recently viewed
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { recentlyViewed: salon._id }
            });
            await User.findByIdAndUpdate(req.user.id, {
                $push: { recentlyViewed: { $each: [salon._id], $position: 0, $slice: 5 } }
            });

            res.status(200).json({ success: true, data: salon });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // C. Favorites
    async addFavorite(req, res) {
        try {
            const { salonId } = req.params;
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { favorites: salonId } });
            res.status(200).json({ success: true, message: "Added to favorites" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async removeFavorite(req, res) {
        try {
            const { salonId } = req.params;
            await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: salonId } });
            res.status(200).json({ success: true, message: "Removed from favorites" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getFavorites(req, res) {
        try {
            const user = await User.findById(req.user.id).populate("favorites");
            res.status(200).json({ success: true, data: user.favorites });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new CustomerController();
