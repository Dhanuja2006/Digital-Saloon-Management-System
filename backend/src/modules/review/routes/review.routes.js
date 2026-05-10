import express from "express";
import reviewController from "../controllers/review.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/salon/:salonId", reviewController.getSalonReviews);
router.post("/", protect, reviewController.createReview);

// Admin moderation
// router.get("/", protect, authorize("Admin"), reviewController.getAllReviews);
// router.delete("/:id", protect, authorize("Admin"), reviewController.deleteReview);

export default router;
