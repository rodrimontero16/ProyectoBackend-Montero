import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

//Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//Esta class la uso para manejar los errores
export class Exception extends Error {      
    constructor(message, status) {
        super(message);                    
        this.statusCode = status;
    }
};  

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);
