import TicketsServices from "../services/ticket.services.js";
import CartsController from "./carts.controller.js";
import ProductsControllers from "./product.controller.js";
import { v4 as uuidv4 } from 'uuid';

export default class TicketsController {
    static async create (cid, userEmail){
        try {
            const cart = await CartsController.getById(cid);
            const purchasedProducts = [];
            let amount = 0;

            for (const prod of cart.products){
                const product = await ProductsControllers.getById(prod.product);
                const quantity = prod.quantity;
                const pid = product._id.toString();

                if(product && product.stock >= quantity){
                    const updateStock = product.stock - quantity; 
                    
                    await ProductsControllers.updateById(pid, {stock: updateStock});
                    
                    let productData = {
                        product: pid,
                        quantity
                    };

                    purchasedProducts.push(productData);

                    const productTotal = quantity * product.price;
                    amount += productTotal;

                    await CartsController.deleteProduct(cid, pid);

                } else {
                    console.log('No hay stock suficiente del producto', product)
                }
            }

            const code = uuidv4();
            const date = new Date();
            const purchaser = userEmail;

            const ticket = await TicketsServices.create(code, date, amount, purchaser, purchasedProducts)
            return ticket;

        } catch (error) {
            console.error('Error inesperado', error)
        }
    };

    static async get(query = {}) {
        return await TicketsServices.get(query);
    };

    static async getById(tid){
        const ticket = await TicketsServices.getById(tid);
        if (!ticket){
            throw new Exception('El ticket no existe ❌', 404);
        }
        return ticket;
    };
}