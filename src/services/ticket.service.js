import TicketDao from "../dao/ticket.dao.js";

export default class TicketsServices {
    static async create(code, purchase_datetime, amount, purchaser, products) {
        return await TicketDao.create(code, purchase_datetime, amount, purchaser, products);
    };

    static get(filter = {}) {
        return TicketDao.get(filter);
    };

    static getById(tid) {
        return TicketDao.getById(tid);
        
    };

    static updateById(tid, payload) {
        return TicketDao.updateById(tid, payload)
    };

    static deleteById(cid){
        return TicketDao.deleteById(tid);
    };
}