import { Router } from "express";
import UsersControllers from "../../controllers/users.controller.js";
import { createHash, isValidPassword, tokenGenerator, verifyToken } from "../../utils/utils.js";
import CartsController from "../../controllers/carts.controller.js";
import passport from "passport";
import emailServices from "../../services/email.service.js";
import { CustomError } from '../../utils/CustomError.js';
import { generatorRegisterError, generatorLoginError, generatorRecoveryError } from '../../utils/CauseMessageError.js';
import  EnumsError  from '../../utils/EnumsError.js';
import JWT from "jsonwebtoken";
import config from "../../config/config.js";

const router = Router();

router.post('/register', async (req, res) =>{
    const {
        first_name,
        last_name,
        email,
        age,
        password
    } = req.body;
    try {
        let newUser = await UsersControllers.getOne({ email });
        if (newUser) {
            CustomError.createError({
                name: 'Error al crear el usuario',
                cause: generatorRegisterError({ email }),
                message: 'Ocurrio un error al registrar el usuario',
                code: EnumsError.INVALID_PARAMS_ERROR
            })
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
    } catch (error) {
        req.logger.error('Error al intentar registrar un nuevo usuario')
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;   
    try {
        const user = await UsersControllers.getOne({email});
        if (!user) {
            CustomError.createError({
                name: 'Error al iniciar sesión',
                cause: generatorLoginError(),
                message: 'Usuario o contraseña incorrecto',
                code: EnumsError.INVALID_PARAMS_ERROR
            })
        }
        const isPassValid = isValidPassword(password, user);
        if (!isPassValid) {
            CustomError.createError({
                name: 'Error al iniciar sesión',
                cause: generatorLoginError(),
                message: 'Usuario o contraseña incorrecto',
                code: EnumsError.INVALID_PARAMS_ERROR
            })
        }
        req.user = user;
        const token = tokenGenerator(user, user.cart);
        res
            .cookie('access_token', token, { maxAge: 1000*60*30, httpOnly: true, signed: true })
            .status(200)
            .redirect('/');
    } catch (error) {
        req.logger.error('Error al intentar iniciar sesion')
        res.status(400).json({ error: error.message });
    }
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
            CustomError.createError({
                name: 'Error al intentar recuperar la contraseña',
                cause: generatorRecoveryError({ email }),
                message: 'El correo proporcionado no existe',
                code: EnumsError.INVALID_PARAMS_ERROR
            })
        }
        const token = JWT.sign({ email }, config.secret.jwtSecret, {expiresIn: '1h'});
        const result = await emailServices.sendEmail(
            email, 
            'Recuperar contraseña',
            `<div>
                <p>Para recuperar tu contraseña, debes ingresar al siguiente enlace: </p>
                <a href="http://localhost:8080/new-password/${token}">AQUI</a>
            </div>
            <div>
                <p>El enlace de recuperación vence en 1 hora despues de recibido este correo.</p>
            </div>
            `
        );
        res.status(200).json('Correo enviado correctamente');
    } catch (error) {
        req.logger.error('Error al intentar recuperar la contraseña')
        res.status(400).json({ error: error.message });
    }
});

router.post('/new-password', async (req, res) => {    
    try {
        const { email, newPassword } = req.body;
        const user = await UsersControllers.getOne({ email });
        if (!user) {
            CustomError.createError({
                name: 'Error al intentar recuperar la contraseña',
                cause: generatorRecoveryError({ email }),
                message: 'El correo proporcionado no existe',
                code: EnumsError.INVALID_PARAMS_ERROR
            })
        }
        const isPassValid = isValidPassword(newPassword, user);
        if(isPassValid){
            res.status(400).json('La contraseña que intenta utilizar ya se utilizo anteriormente')
        }
        let hashedPassword = createHash(newPassword)
        const userUpdate = await UsersControllers.updateById(user.id , { password: hashedPassword });
        res.redirect('/login');
    } catch (error) {
        req.logger.error('Error al intentar cambiar la contraseña')
        res.status(400).json({ error: error.message });
    }
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
        req.logger.fatal('Error al intentar iniciar sesion con github')
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;