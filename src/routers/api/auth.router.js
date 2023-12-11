import { Router } from "express";
import userModel from "../../models/user.model.js";
import { createHash, isValidPassword, tokenGenerator } from "../../utils.js";
import CartsController from "../../controllers/carts.controller.js";

const router = Router();

router.post('/register', async (req, res) =>{
    const {
        first_name,
        last_name,
        email,
        age,
        password
    } = req.body;

    if (
        !first_name || !last_name|| !email|| !age|| !password
    ) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Correo ya existente ❌' });
    }
    user = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    });

    const cart = await CartsController.getOrCreateCart(user._id);
    user.cart = cart._id;
    await user.save();

    res.status(201).redirect('/login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos 😨' });
    }
    const isPassValid = isValidPassword(password, user);
    if (!isPassValid) {
        return res.status(401).json({ message: 'Correo o contraseña invalidos 😨' });
    }
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

router.post('/recovery-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).send('El usuario no existe 😨.');
    }
    await userModel.updateOne({ email }, { $set: { password: createHash(newPassword) } });
    res.redirect('/login');
});
export default router;