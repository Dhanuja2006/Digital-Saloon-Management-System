import express from "express";
import slotController from "../controllers/slot.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes (Customer viewing available slots)
router.get("/", slotController.getSlots);

// Customer reservation endpoint
router.post("/:id/reserve", protect, slotController.reserveSlot);

// Salon Owner Routes
router.post("/generate", protect, authorize("Salon Owner"), slotController.generateSlots);
router.patch("/:id", protect, authorize("Salon Owner", "Admin"), slotController.updateSlotStatus);

export default router;
