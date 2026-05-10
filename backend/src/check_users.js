import mongoose from 'mongoose';
import User from './modules/identity/models/User.js';
import { ENV } from './config/env.js';

const checkUsers = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        const users = await User.find({}).limit(5);
        console.log('Registered Users:');
        users.forEach(user => {
            console.log(`- Email: ${user.email}, Role: ${user.role}, Verified: ${user.isEmailVerified}, Status: ${user.status}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
