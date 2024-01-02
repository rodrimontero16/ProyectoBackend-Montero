import { Router } from "express";
import EmailService from "../../services/email.services.js";
import twilioServices from "../../services/twilio.services.js";

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
});

router.get('/sendSMS', async (req, res, next) => {
    try {
        const result = await twilioServices.sendSMS(
            '+542302314614',
            'Hola desde proyecto backend'
        );

        console.log('envio de sms', result);
        res.status(200).json({message: 'Mensaje enviado correctamente'})
    } catch (error) {
        console.error(error);
        next();
    }
});


export default router;