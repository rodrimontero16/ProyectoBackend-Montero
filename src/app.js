//Logic general
import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';

//Utils
import { __dirname } from './utils.js'

//Routes
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';

//Logic express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Logic public
app.use(express.static(path.join(__dirname, '../public')));

//Logic handlebars
app.engine('handlebars', handlebars.engine()); //motor que uso  
app.set('views', path.join(__dirname, 'views')); //Ruta de las plantillas
app.set('view engine', 'handlebars'); //Extension de las vistas

//Routers
app.use('/', productsRouter, cartsRouter);

//Middlewares error
app.use((error, req, res, next) => {
    const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
    console.log(message);
    res.status(500).json({ status: 'error', message });
});

export default app;