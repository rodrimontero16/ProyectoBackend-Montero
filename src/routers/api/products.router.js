import { Router } from "express";
import ProductsControllers from "../../controllers/product.controller.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils/utils.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

//Obtengo products por id 
router.get('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await ProductsControllers.getById(pid);
            res.status(200).json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }    
});

//Crear products 
router.post('/', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
    async (req, res) => {
        try {
            const { body } = req;
            const user = req.user;
            const newProduct = {
                thumbnails: [],
                code: uuidv4().slice(0, 6),
                ...body};
            
            const existingProduct= await ProductsControllers.findOne( {code : newProduct.code});
            if(existingProduct) {
                res.status(400).json(`El producto con codigo: ${newProduct.code} ya existe`);
                return;
            } 

            const product = await ProductsControllers.create(newProduct);

            if (user.role === 'premium'){
                product.owner = user.email;
            } 
            product.status = product.stock > 0 ? true : false;

            await product.save();
            console.log('producto creado', product);
            res.status(201).json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

//Actualizar product 
router.put('/:pid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin', 'premium']),
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
    authorizationMiddleware(['admin', 'premium']),
    async (req, res) => {
        try {
            const { pid } = req.params;
            const user = req.user;

            if(user.role === 'premium'){
                const product = await ProductsControllers.getById(pid);
                if(product.owner !== user.email){
                    return res.status(400).json('No tiene permisos para eliminar este producto.')
                } 
            }
            await ProductsControllers.deleteById(pid);
            res.status(204).json('Producto eliminado correctamente.');
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
});

export default router;