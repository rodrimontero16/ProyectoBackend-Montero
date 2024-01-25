import  { userRepository } from "../repositories/index.js";

export default class UsersServices {
    static async create(payload) {
        return userRepository.create(payload);
    };

    static get(filter = {}) {
        return userRepository.get(filter);
    };

    static async getOne(criteria){
        const user = await userRepository.getOne(criteria);
        return user ? user : null;
    }

    static getById(uid) {
        return userRepository.getById(uid);
    };

    static async updateById(uid, payload) {
        return userRepository.updateById(uid, payload)
    };

    static deleteById(uid){
        return userRepository.deleteById(uid);
    };
}