import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './modules/identity/models/User.js';
import { ENV } from './config/env.js';

const testBcrypt = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        const email = 'dhanujavidyat@gmail.com';
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log('User found:', user.email);
        
        // I don't know the password, but I can check if it's a valid bcrypt hash
        const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
        console.log('Is Password Hashed:', isHashed);
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testBcrypt();
