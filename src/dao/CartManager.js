import cartModel from '../dao/models/cart.model.js';
import productModel from './models/product.model.js';
import { Exception } from '../utils.js';

export default class CartManager {
    static async create(data){
        const newCart = await cartModel.create(data);
        return newCart;
    };

    static async getById(cid){
        const cart = await cartModel.findById(cid).populate('products.product').exec();
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
                cart.products.push({ product, quantity: 1 });
            }
            await cart.save();
            return cart;
        };
    };

    static async deleteProduct(cid, pid){
        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Exception('El carrito no existe ❌', 404);
        } else {
            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex === -1) {
                throw new Exception('El producto no existe en el carrito ❌', 404);
            }
            cart.products.splice(productIndex, 1); 
            await cart.save();
            return cart;
        }
    };

    static async clearCart(cid){
        const cart = await cartModel.findById(cid);
        if (!cart) {
            throw new Exception('El carrito no existe ❌', 404);
        } else {
            cart.products = [];
            await cart.save();
            return cart;
        }
    };

    static async updateCart(cid, products){
        const cart = await cartModel.findById(cid);
        cart.products = []
        for (const product of products){
            const { product: productId, quantity } = product;
            const productObj = await productModel.findById(productId);
            if (!productObj) {
                throw new Exception('El producto no existe ❌', 404);
            }
            cart.products.push({ product: productObj, quantity });
        }

        await cart.save();
        return cart;
    }

    static async updateProductQuantity(cid, pid, quantity) {
        const cart = await cartModel.findById(cid);
        const product = await productModel.findById(pid);
        if (!product) {
            throw new Exception('El producto no existe ❌', 404);
        }
        const cartProduct = cart.products.find((cartProduct) =>
            cartProduct.product.toString() === pid
        );
        if (!cartProduct) {
            throw new Exception('El producto no existe en el carrito ❌', 404);
        }
        cartProduct.quantity = quantity;
        await cart.save();
        return cart;
    }
};