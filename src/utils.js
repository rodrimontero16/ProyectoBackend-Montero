import path from 'path';
import bcrypt from 'bcrypt';
import  JWT from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import config from './config.js';


//Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//Hasheo de passwor
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

//JWT
export const JWT_SECRET = config.secret.jwtSecret;
export const tokenGenerator = (user) => {
    const {
        _id,
        first_name,
        last_name, 
        email, 
        role 
    } = user;

    const payload = {
        id: _id,
        first_name,
        last_name,
        email,
        role
    };
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '30m' });
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error);
            }
            resolve(payload);
        });
    });
};

export const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role } = req.user;
    if (!roles.includes(role)) {
        return res.status(403).json({ message: 'No premissions' });
    }
    next();
}

//Esta class la uso para manejar los errores
export class Exception extends Error {      
    constructor(message, status) {
        super(message);                    
        this.statusCode = status;
    }
};  

//Funcion para verificar si es admin
export const isAdmin = (role) => {
    return role === 'admin'
};