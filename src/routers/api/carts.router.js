import { Router } from "express";
import CartManager from "../../dao/CartManager.js";

const router = Router();

//Crear un carrito
router.post('/carts', async (req, res) => {
    try {
        const { body } = req;
        const newCart = await CartManager.create(body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Obtener los products de un carts
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartManager.getById(cid);
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Agregar un product al cart
router.post('/carts/:cid/products/:pid', async (req,res) =>{
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await CartManager.addProduct(cid, pid)
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

//Eliminar producto del carrito
router.delete('/carts/:cid/products/:pid', async (req, res) =>{
    try {
        const {cid, pid} = req.params;
        const cart = await CartManager.deleteProduct(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

//Actualizar el carrito
router.put('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await CartManager.updateCart(cid, products);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Actualizar cantidad de un producto en el carrito
router.put('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await CartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Eliminar todos los productos del carrito
router.delete('/carts/:cid', async (req, res) =>{
    try {
        const { cid } = req.params;
        const cart = await CartManager.clearCart(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

export default router;

//ROUTER CON FL
// //Crear nuevo carrito ✔️
// router.post('/carts', (req, res) => {
    
//     fs.readFile('./carts.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo carts.json:', err);
//             return res.status(500).json({ error: 'Error al leer el JSON' });
//         }
//         try {
//             const carts = JSON.parse(data);
//             const newCart ={
//                 id:uuidv4(),
//                 products: []
//                 };
//             carts.push(newCart);

//             fs.writeFile('./carts.json', JSON.stringify(carts, null, '\t'), 'utf-8', (err) => {
//                 if (err) {
//                     console.error('Error al escribir el archivo carts.json:', err);
//                     return res.status(500).json({ error: 'Error al escribir el JSON' });
//                 }
//             });
//             res.status(201).json(newCart);

//         } catch (error) {
//             console.log('Error interno');
//             res.status(500).send('Error interno del servidor')
//         };
//     })
// });

// //Productos del carrito ✔️
// router.get('/carts/:cid', (req, res) =>{
//     const { cid } = req.params;
//     fs.readFile('./carts.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo carts.json:', err);
//             return res.status(500).json({ error: 'Error al leer el JSON' });
//         }
//         try {
//             const carts = JSON.parse(data);
//             const cart = carts.find((carrito) => carrito.id === cid);
//             if (!cart){
//                 res.status(404).send('Carrito no encontrado');
//             } else{
//                 res.status(200).json(cart.products)
//             };
//         } catch (error) {
//             console.log('Error interno');
//             res.status(500).send('Error interno del servidor')
//         };
//     });
// });

// //Agregar producto al carrito ✔️
// router.post('/carts/:cid/product/:pid', (req,res) =>{
//     const { cid } = req.params;
//     const { pid } = req.params;
//     const quantity = req.body.quantity || 1;

//     fs.readFile('./carts.json', 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error al leer el archivo carts.json:', err);
//             return res.status(500).json({ error: 'Error al leer el JSON' });
//         };
//         const carts = JSON.parse(data);
//         const cart =  carts.find((carrito) => carrito.id === cid);
//         if (!cart){
//             res.status(404).send('Carrito no encontrado');
//         } else {
//             const existingProduct = cart.products.find((prod) => prod.product === pid );
//             if (existingProduct){
//                 existingProduct.quantity += quantity;
//             } else{
//                 cart.products.push({product: pid, quantity})
//             }

//         fs.writeFile('./carts.json', JSON.stringify(carts, null, '\t'), 'utf-8', (err) => {
//             if (err) {
//                 console.error('Error al escribir el archivo carts.json:', err);
//                 res.status(500).json({ error: 'Error interno del servidor' });
//                 return;
//             }
//         });
//         res.status(200).json(cart.products);
//         }
//     });
// });

