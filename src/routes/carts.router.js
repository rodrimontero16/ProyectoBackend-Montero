import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';

const router = Router();

//Crear nuevo carrito
router.post('/carts', (req, res) => {
    
    fs.readFile('./carts.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo carts.json:', err);
            return res.status(500).json({ error: 'Error al leer el JSON' });
            return;
        }
        try {
            const carts = JSON.parse(data);
            const newCart ={
                id:uuidv4(),
                products: []
                };
            carts.push(newCart);

            fs.writeFile('./carts.json', JSON.stringify(carts, null, '\t'), 'utf-8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo carts.json:', err);
                    return res.status(500).json({ error: 'Error al escribir el JSON' });
                }
            });
            res.status(201).json(newCart);

        } catch (error) {
            console.log('Error interno');
            res.status(500).send('Error interno del servidor')
        };
    })
});

export default router;