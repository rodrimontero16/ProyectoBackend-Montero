import { Router } from "express";
import ChatManager from "../../dao/ChatManager.js";

const router = Router();

router.post('/chat', async (req, res) => {
    try {
        const { body } = req;
        const newMessage = await ChatManager.createMessage(body);
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.get('/chat', async (req, res) => {
    try {
        const messages = await ChatManager.getMessages();
        res.render('chat', {messages: messages.map(p => p.toJSON()), titlePage: 'Chat'});
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});


export default router;