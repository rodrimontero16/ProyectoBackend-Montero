import UsersServices from "../services/user.services.js";

export default class UsersControllers {
    static async create(payload) {
        const user = await UsersServices.create(payload);
        console.log(`Usuario creado correctamente. ID: ${user._id}`); 
        return user;
    };

    static get(filter = {}) {
        return UsersServices.get(filter);
    };

    static getOne(criteria){
        return UsersServices.getOne(criteria)
    }
    
    static getById(uid) {
        return UsersServices.getById(uid);
    };

    static updateById(uid, payload) {
        return UsersServices.updateById(uid, payload)
    };

    static deleteById(uid){
        return UsersServices.deleteById(uid);
    };
    
}