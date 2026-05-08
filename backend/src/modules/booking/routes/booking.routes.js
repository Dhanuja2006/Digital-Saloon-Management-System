import express from "express";
import bookingController from "../controllers/booking.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, bookingController.createBooking);
router.get("/my-bookings", protect, bookingController.getMyBookings);
router.get("/salon/:salonId", protect, authorize("Salon Owner"), bookingController.getSalonBookings);
router.patch("/:id/status", protect, authorize("Salon Owner", "Admin"), bookingController.updateBookingStatus);
router.delete("/:id/cancel", protect, bookingController.cancelBooking);
router.get("/", protect, authorize("Admin"), bookingController.getAllBookings);

export default router;
