import cartModel from '../dao/models/cart.model.js';
import productModel from './models/product.model.js';
import { Exception } from '../utils.js';

export default class CartManager {
    static async create(data){
        const newCart = await cartModel.create(data);
        return newCart;
    };

    static async getById(cid){
        const cart = await cartModel.findById(cid)
        if (!cart){
            throw new Exception('El carrito no existe ❌', 404);
        }
        return cart;
    };

    static async addProduct(cid, pid){
        const cart = await cartModel.findById(cid);
        if(!cart){
            throw new Exception('El carrito no existe ❌', 404);
        } else{
            const product = await productModel.findById(pid);
            if (!product) {
                throw new Exception('El producto no existe ❌', 404);
            };
            const existingProduct = cart.products.find((cartProduct) =>
            cartProduct.product.toString() === pid
            );
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            await cart.save();
            return cart;
        };
    };
};