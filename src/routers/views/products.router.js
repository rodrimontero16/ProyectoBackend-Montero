import { Router } from 'express';
import ProductsControllers from '../../controllers/product.controller.js';
import passport from "passport";
import { authorizationMiddleware, generateProducts } from '../../utils.js';


const router = Router();

//Products Manager ✔️
router.get('/api/products',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) =>{
        try {
            const { page = 1, limit = 10, category, sort } = req.query;
            const options = { page, limit };
            if (sort) {
                options.sort = { price: sort || 1 };
            }
            const criteria = {};
            if (category) {
                criteria.category = category;
            }
            const products = await ProductsControllers.paginate(criteria, options);
            res.render('productsManager', buildResponse(products, 'Configuracion', 'products.css', 'api/products', category, sort));
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

//Products para el cliente
router.get('/products', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
        const user = req.user;
        const userCartID = user.cart._id.toString();
        const products = await ProductsControllers.paginate(criteria, options);
        const responseData = buildResponse(products, 'Productos', 'products.css', 'products', user, userCartID,category, sort );
        res.render('products', responseData);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export const buildResponse = (data, titlePage, style, route, user, userCartID) => {
    return {
    status: 'success',
    payload: data.docs.map(prod => prod.toJSON()),
    titlePage: titlePage,
    style: style,
    user: user,
    userCartID:userCartID,
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

//ProductsMocking
router.get('/mockingproducts', async (req, res) => {
    const productsMocking = [];
    const limit = 100;
    for (let index = 0; index < limit; index++){
        productsMocking.push(generateProducts());
    }
    res.status(200).json(productsMocking);
})

export default router;