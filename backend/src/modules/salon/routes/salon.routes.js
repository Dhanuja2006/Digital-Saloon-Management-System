import express from "express";
import salonController from "../controllers/salon.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Salon Owner Routes (Move specific routes before parameterized routes)
router.get("/my-salons", protect, authorize("Salon Owner"), salonController.getMySalons);
router.post("/", protect, authorize("Salon Owner"), salonController.createSalon);

// Public Routes
router.get("/", salonController.getSalons);
router.get("/:id", salonController.getSalonById);

router.patch("/:id", protect, authorize("Salon Owner"), salonController.updateSalon);
router.delete("/:id", protect, authorize("Salon Owner"), salonController.deleteSalon);

// Admin Routes
router.get("/admin/pending", protect, authorize("Admin"), salonController.getPendingSalons);
router.patch("/admin/:id/status", protect, authorize("Admin"), salonController.updateSalonStatus);

export default router;
