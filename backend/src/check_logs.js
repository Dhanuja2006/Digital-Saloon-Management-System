import mongoose from 'mongoose';
import AuditLog from './modules/identity/models/AuditLog.js';
import { ENV } from './config/env.js';

const checkLogs = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        const logs = await AuditLog.find({ action: 'LOGIN_ATTEMPT' }).sort({ createdAt: -1 }).limit(10);
        console.log('Recent Login Attempts:');
        logs.forEach(log => {
            console.log(`- Status: ${log.status}, UserID: ${log.userId}, Details: ${JSON.stringify(log.details)}, Time: ${log.createdAt}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkLogs();
