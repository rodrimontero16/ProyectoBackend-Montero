import { Router } from 'express';
import ProductManager from '../../dao/ProductManager.js';

const router = Router();

router.get('/products', async (req, res) => {
    const products = await ProductManager.get();
    res.render('products', {products: products.map(p => p.toJSON()), titlePage: 'Productos'});
});

export default router;