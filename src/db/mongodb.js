import mongoose from "mongoose";
import config from '../config/config.js';

export const URI = config.db.mongodbUri;

export const initDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Database connected ✔️');
    } catch (error) {
        console.error('Error to connect to database ❌', error.message);
    }
};