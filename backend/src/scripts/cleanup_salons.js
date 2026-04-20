import mongoose from "mongoose";
import dotenv from "dotenv";
import Salon from "../modules/salon/models/Salon.js";

dotenv.config({ path: "./.env" });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for cleanup...");

        const salons = await Salon.find().sort({ createdAt: 1 });
        console.log(`Found ${salons.length} total salons.`);

        const seen = new Set();
        const toDelete = [];

        for (const salon of salons) {
            const key = `${salon.ownerId}_${salon.salonName}_${salon.address}`;
            if (seen.has(key)) {
                toDelete.push(salon._id);
            } else {
                seen.add(key);
            }
        }

        if (toDelete.length > 0) {
            console.log(`Deleting ${toDelete.length} duplicate salons...`);
            await Salon.deleteMany({ _id: { $in: toDelete } });
            console.log("Cleanup complete!");
        } else {
            console.log("No duplicates found.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
};

cleanup();
