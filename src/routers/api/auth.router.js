import { Router } from "express";
import UsersControllers from "../../controllers/users.controller.js";
import { createHash, isValidPassword, tokenGenerator } from "../../utils.js";
import CartsController from "../../controllers/carts.controller.js";
import passport from "passport";
import emailServices from "../../services/email.services.js";

const router = Router();

router.post('/register', async (req, res) =>{
    const {
        first_name,
        last_name,
        email,
        age,
        password
    } = req.body;
    let newUser = await UsersControllers.getOne({ email });
    if (newUser) {
        return res.status(400).json({ message: 'Correo ya existente ❌' });
    }
    newUser = await UsersControllers.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    });
    const cart = await CartsController.create({user: newUser.id, products: []});
    newUser.cart = cart._id;
    await newUser.save();
    res.status(201).redirect('/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;   
    const user = await UsersControllers.getOne({email});
    if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos 😨' });
    }
    const isPassValid = isValidPassword(password, user);
    if (!isPassValid) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos 😨' });
    }
    req.user = user;
    const token = tokenGenerator(user, user.cart);
    res
        .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200)
        .redirect('/');
});

router.get('/logout', async (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
});


router.post('/recovery-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UsersControllers.getOne({ email });
        if (!user) {
            return res.status(401).send('El correo no existe 😨.');
        }
        const result = await emailServices.sendEmail(
            email, 
            'Recuperar contraseña',
            `<div>
                <p>Para recuperar tu contraseña, debes ingresar al siguiente enlace: </p>
                <a href="http://localhost:8080/new-password">AQUI</a>
            </div>`
        );
        res.redirect('/login');
    } catch (error) {
        console.log('Error inesperado del servidor', error);
        next(error);
    }
});

router.post('/new-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await UsersControllers.getOne({ email });
    if (!user) {
        return res.status(401).send('El usuario no existe 😨.');
    }
    let hashedPassword = createHash(newPassword)
    const userUpdate = await UsersControllers.updateById(user.id , { password: hashedPassword });
    res.redirect('/login');
});

router.get('/github', passport.authenticate('github', { scope:['user.email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), async (req, res) =>{
    try {
        const user = req.user;
        const token = tokenGenerator(user);
        res
        .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
        .status(200)
        .redirect('/');
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;