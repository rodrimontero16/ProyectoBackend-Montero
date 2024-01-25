//Logic general
import express from 'express';
import passport from 'passport';
import path from 'path';
import handlebars from 'express-handlebars';
import { __dirname } from './utils/utils.js'
import { init as initPassportConfig } from'./config/passport.config.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import cors from 'cors';
import ErrorHandler from './middlewares/ErrorHandler.js';
import { addLogger } from './config/logger.js'

//Routes
import productsApiRouter from './routers/api/products.router.js';
import cartsApiRouter from './routers/api/carts.router.js';
import productsViewsRouter from './routers/views/products.router.js';
import cartsViewsRouter from './routers/views/carts.router.js';
import indexRouter from './routers/views/index.router.js';
import authApiRouter from './routers/api/auth.router.js';
import usersApiRouter from './routers/api/users.router.js';

//Logic express + cookies 
const app = express();
const COOKIE_SECRET = config.secret.cookieSecret;
app.use(addLogger);
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

//cors
const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET','POST','PUT'],
};
app.use(cors(corsOptions));

//Logic handlebars
app.engine('handlebars', handlebars.engine()); //motor que uso  
app.set('views', path.join(__dirname, '../views')); //Ruta de las plantillas
app.set('view engine', 'handlebars'); //Extension de las vistas

//Passport
initPassportConfig();
app.use(passport.initialize());
//app.use(passport.session());

//Routers api
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/auth', authApiRouter);
app.use('/api/users', usersApiRouter);

//Routers views
app.use('/', productsViewsRouter, cartsViewsRouter, indexRouter);

app.get('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found 😨' });
})

//Middlewares error
app.use(ErrorHandler);

export default app;