import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, unique: true },
    age: { type: Number, require: true },
    password: { type: String, require: true },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'premium']},
    provider: { type: String, default: 'register' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    phone: { type: Number, unique: true },
    jwtToken: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);