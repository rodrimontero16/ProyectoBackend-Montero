import dotenv from 'dotenv';

let pathEnvFile = null;

if (process.env.ENV !== 'production') {
    pathEnvFile = './.env.dev';
} else {
    pathEnvFile = './.env.prod';
}
dotenv.config({ path: pathEnvFile });

export default {
    port: process.env.PORT || 8080,
    env: process.env.ENV,
    presistence: process.env.PERSISTENCE,
    db: {
        mongodbUri: process.env.MONGODB_URI
    },
    secret: {
        jwtSecret: process.env.JWT_SECRET,
        cookieSecret: process.env.COOKIE_SECRET
    },    
    github: {
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    }

}