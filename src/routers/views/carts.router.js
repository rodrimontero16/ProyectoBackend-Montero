import { Router } from 'express';
import CartManager from '../../dao/CartManager.js';


const router = Router();

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params; 
        const cart = await CartManager.getById(cid);
        const cartId = cid; 
        const products = cart.products.map(e => {
            return {...e.product._doc, quantity: e.quantity, cartId, totalPrice:e.quantity*e.product.price}
        })
        res.render('carts', {products, titlePage: 'Carrito', style: 'carrito.css'})
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;