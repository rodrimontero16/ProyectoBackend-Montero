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

router.post('/:uid/documents/:typeFile', 
    passport.authenticate('jwt', { session: false }),
    uploader.single('file'),
    async (req, res) =>{
        try {
            const { user: {id}, file, typeFile } = req;
            const user = await UsersControllers.uploadFile(id, typeFile, file);
            res.status(500).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json('Error al subir el.');
        }
});


export default router;