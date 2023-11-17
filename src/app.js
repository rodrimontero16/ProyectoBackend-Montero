//Logic general
import express from 'express';
import passport from 'passport';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js'
import { URI } from './db/mongodb.js'
import { init as initPassportConfig } from'./config/passport.config.js';

//Routes
import productsApiRouter from './routers/api/products.router.js';
import cartsApiRouter from './routers/api/carts.router.js';
import productsViewsRouter from './routers/views/products.router.js';
import cartsViewsRouter from './routers/views/carts.router.js';
import indexRouter from './routers/views/index.router.js';
import sessionApiRouter from './routers/api/sessions.router.js';

//Logic express + sessions
const app = express();

const SESSION_SECRET = 'dmO847bYjCv<J46`<d*-ln71AyP7J';

app.use(expressSession({
    secret: SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {},
        ttl: 3600
    })
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

//Logic handlebars
app.engine('handlebars', handlebars.engine()); //motor que uso  
app.set('views', path.join(__dirname, 'views')); //Ruta de las plantillas
app.set('view engine', 'handlebars'); //Extension de las vistas

//Passport
initPassportConfig();
app.use(passport.initialize());
app.use(passport.session());

//Routers api
app.use('/api', productsApiRouter, cartsApiRouter, sessionApiRouter);
//Routers views
app.use('/', productsViewsRouter, cartsViewsRouter, indexRouter);

//Middlewares error
app.use((error, req, res, next) => {
    const message = `😨 Ah ocurrido un error desconocido: ${error.message}`;
    console.log(message);
    res.status(500).json({ status: 'error', message });
});

export default app;