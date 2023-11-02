import { Router } from "express";
import fs from 'fs';
import ProductManager from "../../dao/ProductManager.js";

const router = Router();


//Obtengo todos los productos y los muestro en el index ✔️
router.get('/', (req, res) => {
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
                res.render('index', {
                    limitProducts,
                    style: 'index.css',
                    titlePage: 'Home'
            })
            } else if (limit < 0){
                res.send('Limite invalido')
            } else {
                res.render('index', {
                    products,
                    style: 'index.css',
                    titlePage: 'Home'
            })
            ;
            }
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

//Obtengo products con mongo
router.get('/products', async (req, res) => {
    const products = await ProductManager.get();
    res.status(200).json(products);
});

//Obtengo products por id con mongo
router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductManager.getById(pid);
        res.status(200).json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }    
});

//Agrego products con mongo
router.post('/products', async (req, res) => {
    const { body } = req;
    const newProduct = {...body}
    const product = await ProductManager.create(newProduct);
    res.status(201).json(product);
});

//Actualizar product con mongo
router.put('/products/:pid', async (req, res) => {
    try {
        const { params: { pid }, body } = req;
        await ProductManager.updateById(pid, body);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Eliminar product con mongo
router.delete('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductManager.deleteById(pid);
        res.status(204).end();
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Productos en realTime ✔️
router.get('/realtimeproducts', (req, res) =>{
    fs.readFile('./products.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const products = JSON.parse(data);

            res.render('realTimeProducts', {
                products,
                style: 'realtime.css',
                titlePage: 'Configurar productos'
            })
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

export default router;


//ROUTES CON FILESYSTEM
//Obtengo productos por su id ✔️
// router.get('/products/:pid', (req, res) =>{
//     const { pid } = req.params;
    
//     fs.readFile('./products.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo products.json:', err);
//             res.status(500).json({ error: 'Error interno del servidor' });
//             return;
//         }
        
//         const products = JSON.parse(data);
//         const product = products.find((prod) => prod.id === pid);

//         if(!product){
//             res.status(404).send('Producto no encontrado');
//         } else {
//             res.status(200).json(product)
//         }
//     })
// })

//Agregar productos ✔️
// router.post('/products', (req, res) => {
//     const { body } = req;
//     if(!body.title || !body.description || !body.price || !body.code || !body.stock){
//         res.status(400).send('Todos los campos son obligatorios');
//         return;
//     }
//     fs.readFile('./products.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo products.json:', err);
//             res.status(500).json({ error: 'Error interno del servidor' });
//             return;
//         }
//         try {
//             const products = JSON.parse(data);
//             const newProduct = { 
//                 id:uuidv4(),
//                 status: true,
//                 thumbnails: [],
//                 ...body
//                 };
            
//             if(products.some((prod) => prod.code === newProduct.code )){
//                 console.log(`El producto con code: ${newProduct.code} ya existe`);
//                 res.status(400).send('Producto ya existente');
//                 return;
//             } else {
//                 products.push(newProduct)
//             };
            

//             fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
//                 if (err) {
//                     console.error('Error al escribir el archivo products.json:', err);
//                     res.status(500).json({ error: 'Error interno del servidor' });
//                     return;
//                 }
//             });
//             res.status(201).send('Producto agregado correctamente')

//         } catch (error) {
//             res.status(500).send('Error interno del servidor')
//         }
//         })
// });

//Actualizar productos ✔️
// router.put('/products/:pid', (req, res) => {
//     const { pid } = req.params;
//     const { body } = req;

//     fs.readFile('./products.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo products.json:', err);
//             res.status(500).json({ error: 'Error interno del servidor' });
//             return;
//         }
//         try {
//             const products = JSON.parse(data)
//             const productIndex = products.findIndex((prod) => prod.id === pid);
//             if (productIndex === -1) {
//                 res.status(400).send('Producto no encontrado');
//                 return;
//             }

//             const updatedProduct = { ...products[productIndex], ...body, id:pid };
//             products[productIndex] = updatedProduct;

//             fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
//                 if (err) {
//                     console.error('Error al escribir el archivo products.json:', err);
//                     res.status(500).json({ error: 'Error interno del servidor' });
//                     return;
//                 }

//                 res.status(200).json(products[productIndex]);
//             });
//         } catch (error) {
//             res.status(500).send('Error interno del servidor')
//         };
//     })
// });

//Eliminar productos ✔️
// router.delete('/products/:pid', (req, res) => {
//     const { pid } = req.params;

//     fs.readFile('./products.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo products.json:', err);
//             res.status(500).json({ error: 'Error interno del servidor' });
//             return;
//         }
//         try {
//             const products = JSON.parse(data);
//             const productIndex = products.findIndex((prod) => prod.id === pid);
//             if (productIndex === -1) {
//                 res.status(400).send('Producto no encontrado');
//             };
//             products.splice(productIndex,1);

//             fs.writeFile('./products.json', JSON.stringify(products, null, '\t'), 'utf-8', (err) => {
//                 if (err) {
//                     console.error('Error al escribir el archivo products.json:', err);
//                     res.status(500).json({ error: 'Error interno del servidor' });
//                     return;
//                 }
//                 res.status(200).send('Producto eliminado');
//             });

//         } catch (error) {
//             res.status(500).send('Error interno del servidor')
//         }
//     })

// });