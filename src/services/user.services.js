import  { userRepository } from "../repositories/index.js";

export default class UsersServices {
    static async create(payload) {
        const user = await userRepository.create(payload);
        console.log(`Usuario creado correctamente. ID: ${user._id}`); 
        return user;
    };

    static get(filter = {}) {
        return userRepository.get(filter);
    };

    static getOne(criteria){
        return userRepository.getOne(criteria)
    }

    static getById(uid) {
        return userRepository.getById(uid);
    };

    static updateById(uid, payload) {
        return userRepository.updateById(uid, payload)
    };

    static deleteById(uid){
        return userRepository.deleteById(uid);
    };
    
}