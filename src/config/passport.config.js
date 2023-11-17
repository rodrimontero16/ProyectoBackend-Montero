import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import userModel from '../dao/models/user.model.js';

const options = {
    usernameField: 'email',
    passReqToCallback: true, //en el callback me recibe el objeto req
};

export const init = () =>{
    passport.use('register', new LocalStrategy( options, async  (req, email, password, done) =>{
        try {
            const user = await userModel.findOne({ email });
            if(user){
                return done( new Error('El correo ya esta registrado'))
            }
            const newUser = await userModel.create({...req.body, password: createHash(password)}); 
            done(null, newUser);
        } catch (error) {
            done( new Error(`Ha ocurrido un error durante el registro: ${error.message}`))
        }
    }));

    passport.use('login', new LocalStrategy( options, async (req, email, password, done) =>{
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(new Error('Correo o contraseña invalidos'));
            }
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done(new Error('Correo o contraseña invalidos'));
            }
            done(null, user);
        } catch (error) {
            done(new Error(`Ha ocurrido un error durante la autenticacion ${error.message}.`));
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (uid, done) => {
        const user = await userModel.findById(uid);
        done(null, user);
    });

};