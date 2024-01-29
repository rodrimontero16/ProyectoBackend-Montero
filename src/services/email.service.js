import nodemailer from 'nodemailer';
import config from '../config/config.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.gmail.userGmail,
                pass: config.gmail.passGmail
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    sendEmail(to, subject, html, attachments = []) {
        return this.transporter.sendMail({
            from: config.gmail.userGmail,
            to,
            subject,
            html, 
            attachments
        })
    }

};

export default new EmailService();