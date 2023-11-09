import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import ProductManager from './dao/ProductManager.js';
import CartManager from './dao/CartManager.js';
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
        socketClient.on('add-to-cart', async (prodId) => {
            await CartManager.addProduct('654d2cf1fdc586a57eb6a939', prodId);
            socketClient.emit('added-to-cart', prodId);
        });
    });
};


//Logic del FL
// const productsFilePath = path.join(__dirname, '../products.json');

//Traigo mis productos del JSON
// const loadProducts = () => {
//     try {
//         const data = fs.readFileSync(productsFilePath, 'utf8');
//         const productsData = JSON.parse(data);
//         return productsData;
//     } catch (error) {
//         console.error('Error al cargar los productos desde el archivo JSON:', error);
//         return [];
//     }
// };

        // socketClient.on('delete-prod', (prodId) => {
        //     const productIndex = products.findIndex((prod) => prod.id === prodId);
        //     if (productIndex === -1){
        //         socketClient.emit('prod-no-encontrado');
        //     } else {
        //         products.splice(productIndex,1);
        //         fs.writeFile(productsFilePath, JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
        //             if (err) {
        //                 console.error('Error al escribir el archivo products.json:', err);
        //                 socketClient.emit('error', 'Error interno del servidor');
        //                 return;
        //             } else {
        //                 socketClient.emit('prod-delete', products );
        //             }
        //         });
        //     }
        // });