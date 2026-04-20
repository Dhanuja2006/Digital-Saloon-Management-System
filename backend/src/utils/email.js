import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
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
    }
};
