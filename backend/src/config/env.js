import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5050,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    ADMIN_CODE: process.env.ADMIN_CODE || "1234",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
};