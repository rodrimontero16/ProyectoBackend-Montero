import { Router } from "express";
import  CartsController  from "../../controllers/carts.controller.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils.js";

const router = Router();

//Crear un carrito
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),    
    async (req, res, next) => {
        try {
            const { body } = req;
            const newCart = await CartsController.create(body);
            res.status(201).json(newCart);
        } catch (error) {
            console.log('Ha ocurrido un error al crear el carrito');
            next(error);
        }
});

//Agregar un product al cart
router.post('/:cid/products/:pid', async (req,res) =>{
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await CartsController.addProduct(cid, pid)
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

//Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) =>{
    try {
        const {cid, pid} = req.params;
        const cart = await CartsController.deleteProduct(cid, pid);
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

        const cart = await CartsController.updateCart(cid, products);
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
        res.status(error.status || 500).json({ message: error.message });
    }
});

export default router;
