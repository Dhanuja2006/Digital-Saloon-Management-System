import express from "express";
import serviceController from "../controllers/service.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/salon/:salonId", serviceController.getSalonServices);
router.get("/:id", serviceController.getServiceById);

// Salon Owner Routes
router.post("/", protect, authorize("Salon Owner"), serviceController.createService);
router.patch("/:id", protect, authorize("Salon Owner"), serviceController.updateService);
router.delete("/:id", protect, authorize("Salon Owner"), serviceController.deleteService);

export default router;
