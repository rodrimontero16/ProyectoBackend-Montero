import mongoose from "mongoose";

export const initDB = async () => {
    try {
        const URI = 'mongodb+srv://rodrimontero16:qJ8NfXF5BJ39IrO9@cluster0.fbmsttx.mongodb.net/ecommerce';
        await mongoose.connect(URI);
        console.log('Database connected ✔️');
    } catch (error) {
        console.error('Error to connect to database ❌', error.message);
    }
};