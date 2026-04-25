import express from "express";
import reviewController from "../controllers/review.controller.js";
import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, reviewController.createReview);
router.get("/salon/:salonId", reviewController.getSalonReviews);
router.patch("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

export default router;
