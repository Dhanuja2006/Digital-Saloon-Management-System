import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: "Too many login attempts from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

export const otpRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 OTP requests per hour
    message: "Too many OTP requests from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
});
