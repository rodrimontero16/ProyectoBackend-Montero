import { Router } from 'express';
import ProductManager from '../../dao/ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('index', {style: 'index.css', titlePage: 'Home'
})
});

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 6, category, sort } = req.query;
        const options = { page, limit };
        if (sort) {
            options.sort = { price: sort || 1 };
        }
        const criteria = {};
        if (category) {
            criteria.category = category;
        }
        const products = await ProductManager.paginate(criteria, options);
        res.render('products', buildResponse(products, 'Productos', 'products.css', 'products', category, sort));
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
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
    prevLink: data.hasPrevPage ? `http://localhost:8080/${route}?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    nextLink: data.hasNextPage ? `http://localhost:8080/${route}?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    };
};


export default router;