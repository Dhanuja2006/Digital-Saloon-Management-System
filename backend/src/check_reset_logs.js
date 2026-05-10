import mongoose from 'mongoose';
import AuditLog from './modules/identity/models/AuditLog.js';
import { ENV } from './config/env.js';

const checkLogs = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        const logs = await AuditLog.find({ action: /PASSWORD_RESET/ }).sort({ createdAt: -1 }).limit(5);
        console.log('Recent Password Reset Activity:');
        logs.forEach(log => {
            console.log(`- Action: ${log.action}, Status: ${log.status}, Time: ${log.createdAt}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkLogs();
