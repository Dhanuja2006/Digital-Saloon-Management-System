import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    ADMIN_CODE: process.env.ADMIN_CODE || "1234",
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
};

console.log("Loaded Environment Variables:");
console.log("- PORT:", ENV.PORT);
console.log("- MONGO_URI:", ENV.MONGO_URI ? "FOUND" : "MISSING");
console.log("- NODE_ENV:", ENV.NODE_ENV);