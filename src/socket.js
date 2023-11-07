import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import ProductManager from './dao/ProductManager.js';
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
                    console.error('Error al verificar el producto');
                    socketClient.emit('error', { message: 'Error al procesar la solicitud' });
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
        })
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