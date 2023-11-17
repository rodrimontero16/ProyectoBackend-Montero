import { Router } from "express";
import passport from "passport";
import userModel from "../../dao/models/user.model.js";
import { isValidPassword, createHash } from '../../utils.js'


const router = Router();

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), (req, res) =>{
    res.redirect('/login');
});

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) =>{
    req.session.user = req.user;
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/api/products');
    } else {
        res.redirect('/products');
    }
});

//Con esta ruta voy a github
router.get('/sessions/github', passport.authenticate('github', { scope:['user.email'] }));
//Con esta ruta vuelvo de github y si todo funciona bien me ingresa
router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) =>{
    req.session.user = req.user;
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/api/products');
    } else {
        res.redirect('/products');
    }
});

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});

router.post('/sessions/recovery-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).send('El usuario no existe 😨.');
    }
    await userModel.updateOne({ email }, { $set: { password: createHash(newPassword) } });
    res.redirect('/login');
});


export default router;