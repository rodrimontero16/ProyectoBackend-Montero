import { Router } from "express";
import UsersControllers from "../../controllers/users.controller.js";
import passport from "passport";
import { authorizationMiddleware, uploader } from "../../utils/utils.js";

const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res) => {
        try {
            const user = await UsersControllers.get();
            const users = user.map(u => {
                return {
                    userID: u.id.toString(),
                    userName: u.fullName,
                    userEmail: u.email,
                    userRole: u.role
                };
            })
            res.render('usersList', {users, titlePage: 'Lista de usuarios', style: 'users.css'})
        } catch (error) {
            console.log(error)
            req.logger.error('Error al mostrar los usuarios')
        }
    });

router.get('/:uid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await UsersControllers.getById(uid);
            const userName = user.first_name;
            const userLastName = user.last_name;
            const userID = user._id; 
            const userRole = user.role;

            res.render('usersEdit', {userName, userLastName , userID, userRole,  titlePage: 'Configuracion de usuario', style: 'users.css'})
        } catch (error) {
            console.log(error)
            req.logger.error('Error al mostrar los usuarios')
        }
    })


router.post('/premium/:uid', 
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['user','premium', 'admin']),
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
            const { user: { id }, file } = req;
            const { documentType } = req.body;
            if (!file) {
                return res.status(400).json('Se debe cargar al menos un documento.')
            }
            await UsersControllers.uploadFile(id, documentType, file);
            res.status(204).clearCookie('access_token').redirect('/login');
        } catch (error) {
            console.error('Error in route:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
});





export default router;