import { Router } from "express";
import fs from 'fs';
import { __dirname } from '../utils.js'
import path from 'path';

const router = Router();

router.get('/realtimeproducts', (req, res) =>{
    const jsonProducts = path.join(__dirname, '../products.json');
    fs.readFile(jsonProducts, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo products.json:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        try {
            const products = JSON.parse(data);

            res.render('realTimeProducts', {
                products,
                style: 'realtime.css',
                titlePage: 'Configurar productos'
            })
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
});

export default router;