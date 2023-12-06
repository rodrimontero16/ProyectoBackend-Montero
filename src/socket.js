import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import ProductManager from './dao/ProductManager.js';
import CartManager from './dao/CartManager.js';
import userModel from './dao/models/user.model.js';
import mongoose from 'mongoose';

let io;

export const init = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {
        console.log(`Se ha conectado un nuevo cliente: (${socketClient.id})`)
        
        socketClient.on('new-product', async (product) => {
            const newProduct = { 
                status: true,
                thumbnails: [],
                ...product
                };

                try {
                    const existingProduct = await ProductManager.findOne({ code: newProduct.code });
                    if (existingProduct) {
                        console.log(`El producto con code: ${newProduct.code} ya existe`);
                        socketClient.emit('prod-existente');
                        return;
                    }
                    else {
                        await ProductManager.create(newProduct);
                        const products = await ProductManager.get();
                        socketClient.emit('add-prod', products);
                    };
                } catch (error) {
                    console.error('Error al verificar el producto', error.message);
                }
        });

        socketClient.on('delete-prod', async (prodId) => {
            if (!mongoose.isValidObjectId(prodId)) {
                console.error(`ID no válido: ${prodId}`);
                socketClient.emit('prod-no-encontrado');
                return;
            }
            try {
                await ProductManager.deleteById(prodId);
                const products = await ProductManager.get();
                socketClient.emit('prod-delete', products);
            } catch (error) {
                console.error('Error al eliminar el producto', error.message);
            }
        });

        socketClient.on('toggle-sort', async (sortDirection) => {
            try {
                const sortParam = { price: sortDirection };
                const sortProducts = await ProductManager.paginate({}, { sort: sortParam });
                const products = sortProducts.docs;
                socketClient.emit('update-products', products);
            } catch (error) {
                console.error('Error al ordenar productos', error.message);
            }
        });
        socketClient.on('filter-by-category', async (selectedCategory) => {
            try {
                const criteria = {};
                const options = { page:1, limit:6 };
                if (selectedCategory) {
                    criteria.category = selectedCategory;
                }
                
                const categoryProducts = await ProductManager.paginate(criteria, options);
                const products = categoryProducts.docs;
                socketClient.emit('update-products', products);
            } catch (error) {
                console.error('Error al filtrar productos por categoría', error.message);
            }
        });
        socketClient.on('add-to-cart', async (prodId, userCart) => {
            await CartManager.addProduct(userCart, prodId);
            socketClient.emit('added-to-cart', prodId);
        });

        socketClient.on('delete-cart', async (cartId) =>{
            try {
                await CartManager.deleteById(cartId);
                const cart = await CartManager.get();
                const carts = cart.map(c => {
                    return {
                        cartID: c._id.toString(),
                        cartLength: c.products.length
                    };
                });
                socketClient.emit('cart-delete', carts)
            } catch (error) {
                console.error('Error al eliminar el carrito', error.message);
            }
        });

        socketClient.on('new-cart', async () =>{
            try {
                const newCart = await CartManager.create();
                const cart = await CartManager.get();
                const carts = cart.map(c => {
                    return {
                        cartID: c._id.toString(),
                        cartLength: c.products.length
                    };
                });
                socketClient.emit('cart-update', carts)
            } catch (error) {
                console.error('Error al crear el carrito', error.message);3
            }
        });
    });
};
