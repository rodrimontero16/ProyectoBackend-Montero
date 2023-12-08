import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    thumbnails: { type: Array, default: [] },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    status: { type: Boolean, default: true, enum: [true, false] }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema);