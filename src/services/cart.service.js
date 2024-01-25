import CartDao from "../dao/cart.dao.js";

export default class CartsServices {
    static async create(payload) {
        const cart = await CartDao.create(payload);
        console.log(`Carrito creado correctamente. ID: ${cart._id}`); 
        return cart;
    };

    static get(filter = {}) {
        return CartDao.get(filter);
    };

    static getById(cid) {
        return CartDao.getById(cid);
        
    };

    static updateById(cid, payload) {
        return CartDao.updateById(cid, payload)
    };

    static deleteById(cid){
        return CartDao.deleteById(cid);
    };
}

