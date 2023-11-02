import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    thumbnails: { type: Array, default: [] },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    status: { type: Boolean, default: true, enum: [true, false] }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);