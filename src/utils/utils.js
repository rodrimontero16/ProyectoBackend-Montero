import path from 'path';
import bcrypt from 'bcrypt';
import  JWT from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import config from '../config/config.js';
import { faker } from '@faker-js/faker';


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
        id,
        fullName, 
        email, 
        role 
    } = user;

    const payload = {
        id,
        fullName,
        email,
        role
    };

    return JWT.sign(payload, JWT_SECRET, { expiresIn: '1h' });
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
    return role === 'admin' || role === 'premium'
};

//Calcular total de carritos
export const calcularTotal = (products) => {
    return products.reduce((total, product) => total + (product.quantity * product.price || 0), 0);
}

//Crear productsMocks
export const generateProducts = () =>{
    const stock = faker.number.int({min: 0, max: 25});
    const status = stock > 0; 

    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        category: faker.commerce.department(),
        code: faker.string.alphanumeric({ length: 10 }),
        thumbnails: faker.image.url(),
        price: faker.commerce.price(),
        stock: stock,
        status: status,
    };
};

