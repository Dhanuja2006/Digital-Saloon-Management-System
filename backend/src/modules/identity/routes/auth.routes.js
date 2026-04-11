import express from "express";
import {
    signup,
    login,
    logout,

    refresh,
    forgotPassword,
    resetPassword,
    requestEmailVerification,
    verifyEmail,
    getMe,
    updateProfile,
    uploadProfileImage,
} from "../controllers/auth.controller.js";

import { protect } from "../../../middleware/auth.middleware.js";
import { upload } from "../../../middleware/upload.js";

import { loginRateLimiter, otpRateLimiter } from "../../../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginRateLimiter, login);

router.post("/refresh-token", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/email/request-verification", requestEmailVerification);
router.post("/email/verify", verifyEmail);

// Profile Routes (Protected)
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.post("/profile/image", protect, upload.single("image"), uploadProfileImage);

router.post("/logout", protect, logout);




export default router;
