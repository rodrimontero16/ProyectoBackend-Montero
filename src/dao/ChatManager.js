import messageModel from "./models/message.model.js";
import { Exception } from '../utils.js';

export default class ChatManager {
    static async createMessage(data){
        try {
            const newMessage = await messageModel.create(data);
            await newMessage.save();
            return newMessage;
        } catch (error) {
            throw new Exception('Error al enviar el mensaje ❌', 500);
        }
    }

    static async getMessages(){
        try {
            const messages = await messageModel.find();
            return messages;
        } catch (error) {
            throw new Exception('Error al obtenerlos mensajes ❌', 500);
        }
    }
};

