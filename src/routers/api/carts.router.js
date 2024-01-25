import { Router } from "express";
import  CartsController  from "../../controllers/carts.controller.js";
import TicketsController from "../../controllers/ticket.controller.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils/utils.js";

const router = Router();

//Crear un carrito
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),    
    async (req, res, next) => {
        try {
            const { body } = req;
            const newCart = await CartsController.create(body);
            res.status(201).json(newCart);
        } catch (error) {
            req.logger.error('Error al crear el carrito')
            next(error);
        }
});

//Agregar un product al cart
router.post('/:cid/products/:pid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user', 'premium']),
    async (req,res, next) =>{
        try {
            const { cid } = req.params;
            const { pid } = req.params;
            const cart = await CartsController.addProduct(cid, pid)
            res.status(200).json(cart);
        } catch (error) {
            req.logger.error('Error al agregar producto al carrito')
            next(error);
        }
});

//Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res, next) =>{
    try {
        const {cid, pid} = req.params;
        const cart = await CartsController.deleteProduct(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        req.logger.error('Error al eliminar producto del carrito')
        next(error);
    }
});

//Actualizar el carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await CartsController.updateCart(cid, products);
        res.status(200).json(cart);
    } catch (error) {
        req.logger.error('Error al actualizar el carrito')
        next(error);
    }
});

//Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartsController.updateProductQuantity(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

//Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) =>{
    try {
        const { cid } = req.params;
        const cart = await CartsController.clearCart(cid);
        res.status(200).json(cart);
    } catch (error) {
        req.logger.error('Error al vaciar el carrito')
            next(error);
    }
});

//Finalizar compra
router.post('/:cid/purchase',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user', 'premium']),
    async (req, res) =>{
        try {
            const { cid } = req.params; 
            const cart = await CartsController.getById(cid);
            
            const userEmail = cart.user.email;
            
            const ticket = await TicketsController.create(cid, userEmail);

            const products = ticket.products.map(e => {
                return {product: e.product, quantity: e.quantity}
            }) 

            res.render('ticket', {   
                code: ticket.code,
                purchase_datetime: ticket.purchase_datetime,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
                products: products}
                )
            
        } catch (error) {
            req.logger.fatal('Error al finalizar la compra')
            next(error);
        }
})

export default router;
