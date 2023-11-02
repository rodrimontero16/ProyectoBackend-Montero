import mongoose, { Schema } from "mongoose";

const cartProductSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
    products: [cartProductSchema],
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);