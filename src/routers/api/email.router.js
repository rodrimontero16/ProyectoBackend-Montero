import { Router } from "express";
import EmailService from "../../services/email.services.js";

const router = Router();

router.get('/sendEmail', async (req, res, next) =>{
    try {
        const result = await EmailService.sendEmail(
            'rodrimontero16@gmail.com',
            'Este es un correo de prueba',
            `<div>
                <h1>Hola, este es un correo de prueba</h1>
                <p>Esto es un parrafo</p>
            </div>
            `
        );
    
        console.log('envio de correo', result);
        res.status(200).json({message: 'Correo enviado correctamente'})
    } catch (error) {
        console.error(error);
        next();
    }
})

export default router;