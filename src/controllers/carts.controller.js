import CartsServices from "../services/cart.services.js";
import { Exception } from "../utils.js";
import ProductsControllers from "../controllers/product.controller.js"

export default class CartsController {
    static async create(data){
        const cart = await CartsServices.create(data);
        return cart;
    };

    static async get(query = {}) {
        return await CartsServices.get(query);
    };

    static async getOrCreateCart(userId) {
        const existingUserCart = await CartsServices.get({ user: userId });
        if (existingUserCart) {
            return existingUserCart;
        } else {
    
            const newCart = await CartsServices.create({ user: userId, products: [] });
            return newCart;
        }
    };

    static async getById(cid){
        const cart = await CartsServices.getById(cid).populate('products.product').exec();
        if (!cart){
            throw new Exception('El carrito no existe ❌', 404);
        }
        return cart;
    };

    static async deleteById(cid){
        const cart = await CartsServices.getById(cid);
        if (!cart){
            throw new Exception('Carrito no encontrado ❌', 404);
        };
        await CartsServices.deleteById(cid);
    }

    static async addProduct(cid, pid){
        const cart = await CartsServices.getById(cid);
        if(!cart){
            throw new Exception('El carrito no existe ❌', 404);
        } else{
            const product = await ProductsControllers.getById(pid);
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
        const cart = await CartsServices.getById(cid);
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
        const cart = await CartsServices.getById(cid);
        if (!cart) {
            throw new Exception('El carrito no existe ❌', 404);
        } else {
            cart.products = [];
            await cart.save();
            return cart;
        }
    };

    static async updateCart(cid, products){
        const cart = await CartsServices.getById(cid);
        cart.products = []
        for (const product of products){
            const { product: productId, quantity } = product;
            const productObj = await ProductsControllers.getById(productId);
            if (!productObj) {
                throw new Exception('El producto no existe ❌', 404);
            }
            cart.products.push({ product: productObj, quantity });
        }

        await cart.save();
        return cart;
    }

    static async updateProductQuantity(cid, pid, quantity) {
        const cart = await CartsServices.getById(cid);
        const product = await ProductsControllers.getById(pid);
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