import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    user: { type: String, require: true },
    message: { type: String, require: true }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);