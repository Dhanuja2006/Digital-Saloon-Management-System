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
} from "../controllers/auth.controller.js";

import { protect } from "../../../middleware/auth.middleware.js";
import { loginRateLimiter, otpRateLimiter } from "../../../middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginRateLimiter, login);

router.post("/refresh-token", refresh);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/email/request-verification", requestEmailVerification);
router.post("/email/verify", verifyEmail);
router.post("/logout", protect, logout);


export default router;
