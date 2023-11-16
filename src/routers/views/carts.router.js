import { Router } from 'express';
import CartManager from '../../dao/CartManager.js';


const router = Router();

function calcularTotal(products) {
    return products.reduce((total, product) => total + (product.totalPrice || 0), 0);
}

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