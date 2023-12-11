import { Router } from "express";
import ProductsControllers from "../../controllers/product.controller.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils.js";

const router = Router();

//Obtengo products por id 
router.get('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await ProductsControllers.getById(pid);
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
        const product = await ProductsControllers.create(newProduct);
        res.status(201).json(product);
});

//Actualizar product 
router.put('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('admin'),
    async (req, res) => {
        try {
            const { params: { pid }, body } = req;
            await ProductsControllers.updateById(pid, body);
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
            await ProductsControllers.deleteById(pid);
            res.status(204).end();
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

export default router;