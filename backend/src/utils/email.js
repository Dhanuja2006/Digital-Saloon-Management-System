import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    },
    connectionTimeout: 3000, // 3 seconds
    greetingTimeout: 3000,
    socketTimeout: 3000,
    family: 4, // Force IPv4
});

export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: ENV.EMAIL_USER,
            to,
            subject,
            text,
        });
        if (ENV.NODE_ENV === "development") {
            console.log("-----------------------------------------");
            console.log(`Email Sent To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${text}`);
            console.log("-----------------------------------------");
        } else {
            console.log(`Email sent to ${to}`);
        }
    } catch (error) {
        console.error("Email sending failed:", error);
        throw new Error("Failed to send verification email. Please check your email settings.");
    }
};
