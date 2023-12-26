import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    code: {type: String, unique: true, required: true },
    purchase_datetime: {type: Date, default: Date.now, required: true },
    amount: {type: Number, required: true}, 
    purchaser: {type: String, required: true},
    products : [{
        product: {type: String},
        quantity: {type: Number},
        _id: false
    }]
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);