import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';


const router = Router();


//Obtengo todos los productos ✔️
router.get('/products', (req, res) => {
    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        const { limit } = req.query;
        try {
            const products = JSON.parse(data);
            const limitProducts = products.slice(0, limit);
            if(limit > 0){
                res.json(limitProducts);
            } else if (limit < 0){
                res.send('Limite invalido')
            } else{
                res.json(products)
            };
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Obtengo productos por su id ✔️
router.get('/products/:pid', (req, res) =>{
    const { pid } = req.params;
    
    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        
        const products = JSON.parse(data);
        const product = products.find((prod) => prod.id === pid);

        if(!product){
            res.status(404).send('Producto no encontrado');
        } else {
            res.status(200).json(product)
        }
    })
})

//Agregar productos ✔️
router.post('/products', (req, res) => {
    const { body } = req;
    if(!body.title || !body.description || !body.price || !body.thumbnails || !body.code || !body.stock){
        res.status(400).send('Todos los campos son obligatorios');
        return;
    }
    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const products = JSON.parse(data);
            const newProduct = { 
                id:uuidv4(),
                status: true,
                ...body
                };
            
            if(products.some((prod) => prod.code === newProduct.code )){
                console.log(`El producto con code: ${newProduct.code} ya existe`);
                res.status(400).send('Producto ya existente');
                return;
            } else {
                products.push(newProduct)
            };
            

            fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo products.json:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
            });
            res.status(201).send('Producto agregado correctamente')

        } catch (error) {
            res.status(500).send('Error interno del servidor')
        }
        })
});

//Actualizar productos ✔️
router.put('/products/:pid', (req, res) => {
    const { pid } = req.params;
    const { body } = req;

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const products = JSON.parse(data)
            const productIndex = products.findIndex((prod) => prod.id === pid);
            if (productIndex === -1) {
                res.status(400).send('Producto no encontrado');
                return;
            }

            const updatedProduct = { ...products[productIndex], ...body, id:pid };
            products[productIndex] = updatedProduct;

            fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo products.json:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }

                res.status(200).json(products[productIndex]);
            });
        } catch (error) {
            res.status(500).send('Error interno del servidor')
        };
    })
});

//Eliminar productos ✔️
router.delete('/products/:pid', (req, res) => {
    const { pid } = req.params;

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const products = JSON.parse(data);
            const productIndex = products.findIndex((prod) => prod.id === pid);
            if (productIndex === -1) {
                res.status(400).send('Producto no encontrado');
            };
            products.splice(productIndex,1);

            fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo products.json:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                res.status(200).send('Producto eliminado');
            });

        } catch (error) {
            res.status(500).send('Error interno del servidor')
        }
    })

});

export default router;