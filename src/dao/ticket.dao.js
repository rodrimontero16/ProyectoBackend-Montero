import ticketModel from '../models/ticket.model.js'

export default class TicketDao {
    static async create(code, purchase_datetime, amount, purchaser, products) {
        try {
            const ticket = await ticketModel.create({
                code,
                purchase_datetime,
                amount,
                purchaser,
                products
            });

            return ticket;
        } catch (error) {
            console.error('Error al crear el ticket', error);
        }
    };

    static get(criteria = {}) {
        return ticketModel.find(criteria);
    };

    static getById(tid) {
        return ticketModel.findById(tid);
        
    };

    static updateById(tid, data) {
        return ticketModel.updateOne({_id: tid}, {$set: data})
    };

    static deleteById(tid){
        return ticketModel.deleteOne({ _id: tid });
    };
}