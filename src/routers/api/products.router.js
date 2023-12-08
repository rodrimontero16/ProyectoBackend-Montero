import { Router } from "express";
import ProductManager from "../../dao/ProductManager.js";
//import { buildResponse } from "../views/products.router.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils.js";

const router = Router();

//Obtengo los productos y los muestro ✔️
// router.get('/',
//     passport.authenticate('jwt', { session: false }),
//     authorizationMiddleware('admin'),
//     async (req, res) =>{
//         try {
//             const { page = 1, limit = 10, category, sort } = req.query;
//             const options = { page, limit };
//             if (sort) {
//                 options.sort = { price: sort || 1 };
//             }
//             const criteria = {};
//             if (category) {
//                 criteria.category = category;
//             }
//             const products = await ProductManager.paginate(criteria, options);
//             res.render('productsManager', buildResponse(products, 'Configuracion', 'products.css', 'api/products', category, sort));
//         } catch (error) {
//             res.status(error.statusCode || 500).json({ message: error.message });
//         }
// });

//Obtengo products por id 
router.get('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await ProductManager.getById(pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }    
});

//Agrego products 
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        const { body } = req;
        const newProduct = {...body}
        const product = await ProductManager.create(newProduct);
        res.status(201).json(product);
});

//Actualizar product 
router.put('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { params: { pid }, body } = req;
            await ProductManager.updateById(pid, body);
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

//Eliminar product 
router.delete('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { pid } = req.params;
            await ProductManager.deleteById(pid);
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

export default router;