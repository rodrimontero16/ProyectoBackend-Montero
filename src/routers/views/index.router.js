import { Router } from 'express';

const router = Router();

const isAdmin = (role) => {
    return role === 'admin'
}

router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/api/productsmanager');
    } else if (req.session.user && req.session.user.role === 'user') {
        res.redirect('/products');
    } else {
        res.redirect('/login')
    }
});

router.get('/login', (req, res) =>{
    res.render('login', {style: 'login.css', titlePage:'Login', user: req.session.user })
});

router.get('/register', (req, res) =>{
    res.render('register', {style: 'register.css', titlePage:'Register'})
});

router.get('/profile', (req, res) =>{
    res.render('profile', {style: 'profile.css', titlePage:'Profile', user: req.session.user, isAdmin })
});


export default router;