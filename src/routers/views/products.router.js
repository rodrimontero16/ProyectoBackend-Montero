import { Router } from 'express';
import ProductManager from '../../dao/ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
    const products = await ProductManager.get();
    res.render('index', {
        products,
        style: 'index.css',
        titlePage: 'Home'
})
});

router.get('/products', async (req, res) => {
    const products = await ProductManager.get();
    res.render('products', {products: products.map(p => p.toJSON()), titlePage: 'Productos', style:'products.css'});
});

export default router;