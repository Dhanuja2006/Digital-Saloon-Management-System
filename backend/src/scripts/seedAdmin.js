import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import User from "../modules/identity/models/User.js";

const seedAdmin = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB Connected for Seeding...");

        const adminEmail = "admin@hsm.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log("Admin already exists");
            process.exit();
        }

        await User.create({
            fullName: "System Admin",
            email: adminEmail,
            phone: "0000000000",
            password: "adminpassword123", // You should change this immediately!
            role: "Admin",
            status: "Active",
            isEmailVerified: true,
            isPhoneVerified: true,
        });

        console.log("Admin user created successfully!");
        console.log("Email: admin@hsm.com");
        console.log("Password: adminpassword123");
        
        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
