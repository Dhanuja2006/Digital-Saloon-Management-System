import express from "express";
import salonController from "../controllers/salon.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";
import { salonUpload } from "../../../middleware/salonUpload.js";

const router = express.Router();

// Salon Owner Routes (Move specific routes before parameterized routes)
router.get("/my-salons", protect, authorize("Salon Owner"), salonController.getMySalons);
router.post("/", protect, authorize("Salon Owner"), salonController.createSalon);

router.post("/:id/images", protect, authorize("Salon Owner"), salonUpload.array("images", 5), salonController.uploadSalonImages);
router.delete("/:id/images", protect, authorize("Salon Owner"), salonController.removeSalonImage);
router.get("/:id/analytics", protect, authorize("Salon Owner"), salonController.getSalonAnalytics);

// Public Routes
router.get("/", salonController.getSalons);
router.get("/image/:id", salonController.getSalonImage);
router.get("/:id", salonController.getSalonById);

router.patch("/:id", protect, authorize("Salon Owner"), salonController.updateSalon);
router.delete("/:id", protect, authorize("Salon Owner"), salonController.deleteSalon);

// Admin Routes
router.get("/admin/pending", protect, authorize("Admin"), salonController.getPendingSalons);
router.patch("/admin/:id/status", protect, authorize("Admin"), salonController.updateSalonStatus);

export default router;
