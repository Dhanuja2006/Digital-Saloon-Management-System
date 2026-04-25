import express from "express";
import customerController from "../controllers/customer.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";
import { upload } from "../../../middleware/upload.js";

const router = express.Router();

// Profile Routes
router.get("/me", protect, customerController.getMe);
router.patch("/me", protect, customerController.updateProfile);
router.post("/me/profile-image", protect, upload.single("image"), customerController.uploadProfileImage);

// Salon Discovery
router.get("/salons", customerController.browseSalons);
router.get("/salons/:id", protect, customerController.getSalonDetails);

// Favorites
router.post("/favorites/:salonId", protect, customerController.addFavorite);
router.get("/favorites", protect, customerController.getFavorites);
router.delete("/favorites/:salonId", protect, customerController.removeFavorite);

export default router;
