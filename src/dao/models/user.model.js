import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, default: 'user', enum: ['user', 'admin']},
    provider: { type: String, default: 'register' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    jwtToken: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);