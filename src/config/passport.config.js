import passport from 'passport';
//import { Strategy as LocalStrategy } from 'passport-local';
//import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { createHash, isValidPassword, JWT_SECRET } from '../utils.js';
import userModel from '../models/user.model.js';

// const options = {
//     usernameField: 'email',
//     passReqToCallback: true, //en el callback me recibe el objeto req
// };

// const githubOptions = { //esto tengo que pasarlo por parametro
//     clientID: 'Iv1.e7ee2e533c0ead9c', 
//     clientSecret: 'b8022cad1ec89387b4806797c2abfb2c2d9c4add', 
//     callbackURL: "http://localhost:8080/api/sessions/github/callback", 
// }

function cookieExtractor(req) {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]) ,
    secretOrKey: JWT_SECRET
};

export const init = () =>{
    /*passport.use('register', new LocalStrategy( options, async  (req, email, password, done) =>{
        try {
            const user = await userModel.findOne({ email });
            if(user){
                return done( new Error('El correo ya esta registrado'))
            }
            const newUser = await userModel.create({...req.body, password: createHash(password)}); 
            done(null, newUser); //siempre el primer parametro es el error, y el segundo lo que le quiero mandar
        } catch (error) {
            done( new Error(`Ha ocurrido un error durante el registro: ${error.message}`)) //como solo mando un error no necesito un segundo parametro
        }
    }));

    passport.use('login', new LocalStrategy( options, async (req, email, password, done) =>{
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done();
            }
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done();
            }
            done(null, user);
        } catch (error) {
            done(new Error(`Ha ocurrido un error durante la autenticacion: ${error.message}.`));
        }
    }));

    passport.use('github', new GithubStrategy( githubOptions, async (accessToken, refreshToken, profile, done) =>{ //estos parametros son diferentes en cada estrategia
        let email =  profile._json.email;
        if(!email){
            let data = await fetch('https://api.github.com/user/public_emails', {
                headers: {
                    Authorization: `token ${accessToken}`,
                }
            });
            data = await data.json();
            const target = data.find((item) => item.primary && item.verified && item.visibility === 'public');
            email = target.email;
        }
        let user = await userModel.findOne({ email });

        //Me fijo si existe, si existe hicia sesion
        if(user){
            return done(null, user);
        };

        //Si no existe creo el usuario
        user = {
            first_name: profile._json.name,
            last_name: '',
            email: email,
            age: 18,
            password: '',
            provider: 'Github',
            role: 'user'
        }
        const newUser = await userModel.create(user);
        done(null, newUser)

    }));

    passport.serializeUser((user, done) => { //guardo solo el id del user en la session en lugar de todo el usuario
        done(null, user._id);
    });
    
    passport.deserializeUser(async (uid, done) => { //traigo todo lo que tiene el user a traves de su id
        const user = await userModel.findById(uid);
        done(null, user);
    });*/

    passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) =>{
        try {
            const user = await userModel.findById(payload.id).populate('cart');
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }))
};