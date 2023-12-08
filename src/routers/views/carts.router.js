import { Router } from 'express';
import CartManager from '../../dao/CartManager.js';
import passport from 'passport';
import { authorizationMiddleware } from '../../utils.js';


const router = Router();

function calcularTotal(products) {
    return products.reduce((total, product) => total + (product.totalPrice || 0), 0);
}

//CartsManager
router.get('/api/carts',
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

//Obtengo un carrito especifico
router.get('/api/carts/:cid', async (req, res) => {
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

//Carrito de cada cliente
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params; 
        const cart = await CartManager.getById(cid);
        const cartId = cid; 
        const products = cart.products.map(e => {
            return {...e.product._doc, quantity: e.quantity, cartId, totalPrice:e.quantity*e.product.price}
        })
        const totalCompra = calcularTotal(products);
        res.render('carts', {products, totalCompra, titlePage: 'Carrito', style: 'carts.css'})
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;