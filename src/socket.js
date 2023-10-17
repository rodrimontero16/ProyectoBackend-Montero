import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { __dirname } from './utils.js';
import { v4 as uuidv4 } from "uuid";

let io;

const productsFilePath = path.join(__dirname, '../products.json');

//Traigo mis productos del JSON
const loadProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf8');
        const productsData = JSON.parse(data);
        return productsData;
    } catch (error) {
        console.error('Error al cargar los productos desde el archivo JSON:', error);
        return [];
    }
};

let products = loadProducts();

export const init = (httpServer) => {
    io = new Server(httpServer);

    io.on('connection', (socketClient) => {
        console.log(`Se ha conectado un nuevo cliente: (${socketClient.id})`)
        
        socketClient.on('new-product', (product) => {
            const newProduct = { 
                id:uuidv4(),
                status: true,
                thumbnails: [],
                ...product
                };
            if(products.some((prod) => prod.code === newProduct.code )){
                console.log(`El producto con code: ${newProduct.code} ya existe`);
                io.emit('prod-existente');
                return;
            } else {
                products.push(newProduct);
                fs.writeFile(productsFilePath, JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
                    if (err) {
                        console.error('Error al escribir el archivo products.json:', err);
                        socketClient.emit('error', 'Error interno del servidor');
                        return;
                    } else {
                        io.emit('add-prod', { products });
                    }
                });
            };
        });

        socketClient.on('delete-prod', (prodId) => {
            const productIndex = products.findIndex((prod) => prod.id === prodId);
            if (productIndex === -1){
                io.emit('prod-no-encontrado');
            } else {
                products.splice(productIndex,1);
                fs.writeFile(productsFilePath, JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
                    if (err) {
                        console.error('Error al escribir el archivo products.json:', err);
                        socketClient.emit('error', 'Error interno del servidor');
                        return;
                    } else {
                        io.emit('prod-delete', products );
                    }
                });
            }
        });
    });
};