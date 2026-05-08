import express from "express";
import {
    getAllSalons,
    updateSalonStatus,
    getPendingSalons,
    getUsers,
    updateUserStatus
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Only Admins can access these routes
router.use(protect);
router.use(authorize("Admin"));


router.get("/salons", getAllSalons);
router.get("/salons/pending", getPendingSalons);
router.patch("/salons/:id/status", updateSalonStatus);

router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);

export default router;
