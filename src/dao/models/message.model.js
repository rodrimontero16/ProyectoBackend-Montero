import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    email: { type: String, require: true },
    message: { type: String, require: true }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);