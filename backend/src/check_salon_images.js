import mongoose from 'mongoose';
import Salon from './modules/salon/models/Salon.js';
import { ENV } from './config/env.js';

const checkSalonImages = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        const salons = await Salon.find({ images: { $exists: true, $not: { $size: 0 } } });
        console.log('Salons with images:');
        salons.forEach(salon => {
            console.log(`- Salon: ${salon.salonName}, Images: ${JSON.stringify(salon.images)}`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSalonImages();
