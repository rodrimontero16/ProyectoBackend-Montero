import { Router } from "express";
import UsersControllers from "../../controllers/users.controller.js";
import passport from "passport";
import { authorizationMiddleware, uploader } from "../../utils/utils.js";

const router = Router();

router.post('/premium/:uid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user','premium']),
    async (req, res) =>{
            try {
                const { uid } = req.params;
                const user = await UsersControllers.updateUserRole(uid);
                console.log('usuario actualizado', user);
                res.status(200).redirect('/api/auth/logout');
            } catch (error) {
                console.error(error);
                res.status(500).json('Error al actualizar el rol del usuario.');
            }
});

router.post('/:uid/documents/', 
    passport.authenticate('jwt', { session: false }),
    uploader.single('file'),
    async (req, res) =>{
        try {
            const { user: { id }, file, params: { documentType } } = req;
            if (!file) {
                return res.status(400).json('Se debe cargar al menos un documento.')
            }
            await UsersControllers.uploadFile(id, documentType, file);
            res.status(204).end();
        } catch (error) {
            
        }

});


export default router;