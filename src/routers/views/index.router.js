import { Router } from 'express';
import { verifyToken, isAdmin } from '../../utils/utils.js';
import JWT from "jsonwebtoken";
import config from "../../config/config.js";

const router = Router();

router.get('/', async (req, res) => {
    const token = req.signedCookies['access_token'];
    if(token){
        try {
            const user = await verifyToken(token);
            if (user.role === 'admin') {
                return res.redirect('/api/products');
            } else {
                return res.redirect('/products');
            }
        } catch (error) {
            console.error(error);
            return res.redirect('/login');
        }
    }
    res.redirect('/login');
});

router.get('/login', (req, res) =>{
    res.render('login', {style: 'login.css', titlePage:'Login'})
});

router.get('/register', (req, res) =>{
    res.render('register', {style: 'register.css', titlePage:'Register'})
});

router.get('/profile', async (req, res) => {
    try {
        const token = req.signedCookies['access_token'];
        const user = await verifyToken(token);
        const documents = user.documents;
        console.log('documents', documents)
        res.render('profile', { style: 'login.css', titlePage: 'Profile', user, isAdmin: isAdmin(user.role) });
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});


router.get('/recovery-password', (req, res) => {
    res.render('recovery-password', { style:'recovery.css' ,titlePage: 'Recuperar contraseña'});
});

router.get('/new-password/:token', (req, res) => {
    try {
        const { token } = req.params;
        const tokenEmail = JWT.verify(token, config.secret.jwtSecret);
        res.render('newPassword', { titlePage: 'Nueva contraseña' });
    } catch (error) {
        res.status(401).render('tokenExpired', { style:'recovery.css' ,titlePage: 'Recuperar contraseña'});
    }
    
});

router.get('/loggerTest', async (req, res) => {
    req.logger.debug('Esta es una prueba de log debug');
    req.logger.http('Esta es una prueba de log http');
    req.logger.info('Esta es una prueba de log info');
    req.logger.warning('Esta es una prueba de log warning');
    req.logger.error('Esta es una prueba de log error');
    req.logger.fatal('Esta es una prueba de log fatal');
    res.status(200).send('ok');
})

export default router;