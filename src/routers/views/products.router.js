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
    const { page = 1, limit = 5 } = req.query;
    const options = { page, limit };
    const criteria = {};
    const products = await ProductManager.paginate(criteria, options);
    res.render('products', buildResponse(products, 'Productos', 'products.css', 'products'));
});

export const buildResponse = (data, titlePage, style, route) => {
    return {
    status: 'success',
    payload: data.docs.map(prod => prod.toJSON()),
    titlePage: titlePage,
    style: style,
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage ? `http://localhost:8080/${route}?limit=${data.limit}&page=${data.prevPage}` : '',
    nextLink: data.hasNextPage ? `http://localhost:8080/${route}?limit=${data.limit}&page=${data.nextPage}` : '',
    };
};

export default router;