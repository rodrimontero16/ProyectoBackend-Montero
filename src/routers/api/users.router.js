import { Router } from "express";
import UsersControllers from "../../controllers/users.controller.js";
import passport from "passport";
import { authorizationMiddleware } from "../../utils/utils.js";

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

export default router;