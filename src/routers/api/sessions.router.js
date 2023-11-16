import { Router } from "express";
import userModel from "../../dao/models/user.model.js";


const router = Router();

router.post('/sessions/register', async (req, res) =>{
    const { body } = req; 
    const newUser = await userModel.create(body); //agregar validaciones para lo que ponga el usuario
    res.redirect('/login');
});

router.post('/sessions/login', async (req, res) =>{
    const { body: { email, password } } = req;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(401).send('Correo o contraseña invalidos 😨.');
    }
    const isPassValid = user.password === password;
    if (!isPassValid) {
        return res.status(401).send('Correo o contraseña invalidos 😨.');
    }
    const { first_name, last_name, role } = user;
    req.session.user = { first_name, last_name, email, role };

    if (req.session.user && req.session.user.role === 'admin') {
        return res.redirect('/api/productsmanager');
    } else {
        res.redirect('/products');
    }
});

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});


export default router;