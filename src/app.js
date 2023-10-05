import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router';
import cartsRouter from './routes/carts.router';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../public')));

app.use('/api', petsRouter, usersRouter);

app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});