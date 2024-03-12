import { Server } from 'socket.io';
import { __dirname } from './utils/utils.js';
import ProductsControllers from './controllers/product.controller.js';
import CartsController from './controllers/carts.controller.js';
import mongoose from 'mongoose';
import UsersControllers from './controllers/users.controller.js';
import moment from 'moment';
import emailService from './services/email.service.js';

let io;

export const init = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', async (socketClient) => {
        console.log(`Se ha conectado un nuevo cliente: (${socketClient.id})`)
        
        socketClient.on('new-product', async (product) => {
            const products = await ProductsControllers.get();
            socketClient.emit('add-prod', products);
        });

        socketClient.on('delete-prod', async (prodId) => {
            if (!mongoose.isValidObjectId(prodId)) {
                console.error(`ID no válido: ${prodId}`);
                socketClient.emit('prod-no-encontrado');
                return;
            }
            try {
                await ProductsControllers.deleteById(prodId);
                const products = await ProductsControllers.get();
                socketClient.emit('prod-delete', products);
            } catch (error) {
                console.error('Error al eliminar el producto', error.message);
            }
        });

        socketClient.on('toggle-sort', async (sortDirection) => {
            try {
                const sortParam = { price: sortDirection };
                const sortProducts = await ProductsControllers.paginate({}, { sort: sortParam });
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
                
                const categoryProducts = await ProductsControllers.paginate(criteria, options);
                const products = categoryProducts.docs;
                socketClient.emit('update-products', products);
            } catch (error) {
                console.error('Error al filtrar productos por categoría', error.message);
            }
        });
        socketClient.on('add-to-cart', async (prodId, userCart) => {
            await CartsController.addProduct(userCart, prodId);
            socketClient.emit('added-to-cart', prodId);
        });

        socketClient.on('delete-cart', async (cartId) =>{
            try {
                await CartsController.deleteById(cartId);
                const cart = await CartsController.get();
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
                const newCart = await CartsController.create();
                const cart = await CartsController.get();
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

        socketClient.on('user-role-change', async ({selectedRole, userID}) =>{
            const user = await UsersControllers.getById(userID)
            await UsersControllers.updateById(userID, {role: selectedRole});
            user.save();
            socketClient.emit('user-update', user)
        });

        socketClient.on('user-delete', async (userID) => {
            await UsersControllers.deleteById(userID);
            socketClient.emit('user-delete-confirm');
        });

        socketClient.on('delete-users-inactive', async () =>{
            try {
                const allUsers = await UsersControllers.getAll();
                const currentDateTime = new Date();
                const inactivityLimit = moment(currentDateTime).subtract(2, 'minutes');
                const usersToDelete = allUsers.filter(user => {
                    return user.role === 'user' && moment(user.last_connection).isBefore(inactivityLimit);
                });
                if (usersToDelete.length === 0){
                    socketClient.emit('no-user-delete')
                } else {
                    for (const userToDelete of usersToDelete) {
                        const result = await emailService.sendEmail(
                            userToDelete.email, 
                            'Usuario eliminado',
                            `<div>
                                <p>Su usuario ha sido eliminado por inactividad. Para volver a utilizar nuestro sitio web deberá volver a registrarse. Muchas gracias</p>
                            </div>
                            `
                        );
                        await UsersControllers.deleteById(userToDelete.id); 
                    }
                    socketClient.emit('user-delete-confirm')
                }
            } catch (error) {
                console.error(error);
                console.log('Error al eliminar los usuarios')
            }
        })
    });
};
