import { Router } from "express";
import EmailService from "../../services/email.service.js";
import twilioServices from "../../services/twilio.service.js";

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
        req.logger.error('Error al enviar correo')
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
        req.logger.error('Error al enviar SMS')
        next();
    }
});


export default router;