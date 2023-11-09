//Logic general
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import handlebars from 'express-handlebars';

//Utils
import { __dirname } from './utils.js'

//Routes
import productsApiRouter from './routers/api/products.router.js';
import cartsApiRouter from './routers/api/carts.router.js';
import productsViewsRouter from './routers/views/products.router.js';
import cartsViewsRouter from './routers/views/carts.router.js';

//Logic express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies
app.use(cookieParser());

//Logic public
app.use(express.static(path.join(__dirname, '../public')));

//Logic handlebars
app.engine('handlebars', handlebars.engine()); //motor que uso  
app.set('views', path.join(__dirname, 'views')); //Ruta de las plantillas
app.set('view engine', 'handlebars'); //Extension de las vistas

//Routers api
app.use('/api', productsApiRouter, cartsApiRouter);
//Routers views
app.use('/', productsViewsRouter, cartsViewsRouter);


//Middlewares error
app.use((error, req, res, next) => {
    const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
    console.log(message);
    res.status(500).json({ status: 'error', message });
});

export default app;