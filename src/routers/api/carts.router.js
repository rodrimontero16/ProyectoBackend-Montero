import { Router } from "express";
import CartManager from "../../dao/CartManager.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils.js";

const router = Router();

//Crear un carrito
router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const newCart = await CartManager.create(body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Obtener todos los carritos y los muestro
router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) =>{
        try {
            const cart = await CartManager.get();
            const carts = cart.map(c => {
                return {
                    cartID: c._id.toString(),
                    cartLength: c.products.length,
                    userCart: c.user.toString()
                };
            })
            res.render('cartsManager', {carts, titlePage: 'CartsManager', style: 'carts.css'})
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

//Obtener los products de un carts y los muestro
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartManager.getById(cid);
        const cartID = cid; 
        const products = cart.products.map(e => {
            return {...e.product._doc, quantity: e.quantity, cartID}
        })
        res.render('cartProduct', {products, titlePage: 'Editar carrito', style:'carts.css'})
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Agregar un product al cart
router.post('/:cid/products/:pid', async (req,res) =>{
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
router.delete('/:cid/products/:pid', async (req, res) =>{
    try {
        const {cid, pid} = req.params;
        const cart = await CartManager.deleteProduct(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

//Actualizar el carrito
router.put('/:cid', async (req, res) => {
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
router.put('/:cid/products/:pid', async (req, res) => {
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
router.delete('/:cid', async (req, res) =>{
    try {
        const { cid } = req.params;
        const cart = await CartManager.clearCart(cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

export default router;
