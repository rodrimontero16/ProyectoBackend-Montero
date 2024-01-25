import { Router } from 'express';
import  CartsController from '../../controllers/carts.controller.js';
import passport from 'passport';
import { authorizationMiddleware, calcularTotal } from '../../utils/utils.js';

const router = Router();


//CartsManager
router.get('/api/carts',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res, next) =>{
        try {
            const cart = await CartsController.get(req.query);
            const carts = cart.map(c => {
                return {
                    cartID: c._id.toString(),
                    cartLength: c.products.length,
                    userCart: c.user.toString()
                };
            })
            res.render('cartsManager', {carts, titlePage: 'CartsManager', style: 'carts.css'})
        } catch (error) {
            req.logger.error('Error al mostrar los productos del carrito')
            next(error)
        }
});

//Obtengo un carrito especifico
router.get('/api/carts/:cid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res, next) => {
        try {
            const { cid } = req.params;
            const cart = await CartsController.getById(cid);
            const cartID = cid; 
            const products = cart.products.map(e => {
                return {...e.product._doc, quantity: e.quantity, cartID}
            })
            res.render('cartProduct', {products, titlePage: 'Editar carrito', style:'carts.css'})
        } catch (error) {
            req.logger.error('Error al encontrar el carrito')
            next(error);
        }
});

//Carrito de cada cliente
router.get('/carts/:cid', async (req, res, next) => {
    try {
        const { cid } = req.params; 
        const cart = await CartsController.getById(cid);
        const cartId = cid; 
        const products = cart.products.map(e => {
            return {...e.product._doc, quantity: e.quantity, cartId, totalPrice:e.quantity*e.product.price}
        })
        const totalCompra = calcularTotal(products);
        res.render('carts', {products, totalCompra, cartId, titlePage: 'Carrito', style: 'carts.css'})
    } catch (error) {
        req.logger.error('Error al encontrar el carrito de un cliente')
        next(error);
    }
});

export default router;