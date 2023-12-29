import { Router } from 'express';
import { verifyToken, isAdmin } from '../../utils.js';

const router = Router();

router.get('/', async (req, res) => {
    const token = req.signedCookies['access_token'];
    if(token){
        try {
            const user = await verifyToken(token);
            if (user.role === 'admin') {
                return res.redirect('/api/products');
            } else if (user.role === 'user') {
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
        res.render('profile', { style: 'profile.css', titlePage: 'Profile', user, isAdmin: isAdmin(user.role) });
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});


router.get('/recovery-password', (req, res) => {
    res.render('recovery-password', { style:'recovery.css' ,titlePage: 'Recuperar contraseña'});
});

router.get('/new-password', (req, res) => {
    res.render('newPassword', { titlePage: 'Nueva contraseña' });
});

export default router;