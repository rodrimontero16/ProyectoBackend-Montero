import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { JWT_SECRET } from '../utils/utils.js';
import UserControllers from '../controllers/users.controller.js'
import config from './config.js';


const githubOptions = {
    clientID: config.github.clientId, 
    clientSecret: config.github.clientSecret, 
    callbackURL: "http://localhost:8080/api/auth/github/callback", 
}

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
    passport.use('github', new GithubStrategy( githubOptions, async (accessToken, refreshToken, profile, done) =>{
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
        let user = await UserControllers.getOne({email});
        
        //Me fijo si existe, si existe inicia sesion
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
        const newUser = await UserControllers.create(user);
        done(null, newUser)

    }));

    passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) =>{
        try {
            const user = await UserControllers.getById(payload.id).populate('cart');
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }))
};