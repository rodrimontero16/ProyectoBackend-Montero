//Logic general
import express from 'express';
import path from 'path';
import handlebars from 'express-handlebars';

//Utils
import { __dirname } from './utils.js'

//Routes
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import indexRouter from './routes/index.router.js'
import realTimeRouter from './routes/realtime.router.js'

//Logic express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Logic public
app.use(express.static(path.join(__dirname, '../public')));

//Logic handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use('/', indexRouter, realTimeRouter);

//Routes products y carts
app.use('/api', productsRouter, cartsRouter);

//Middlewares error
app.use((error, req, res, next) => {
    const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
    console.log(message);
    res.status(500).json({ status: 'error', message });
});

export default app;