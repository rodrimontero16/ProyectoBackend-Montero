import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema({
    code: {type: String, unique: true},
    purchase_datetime: {type: Date, default: Date.now },
    amount: Number, 
    purchaser: { type:mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);