import UsersServices from "../services/user.services.js";

export default class UsersControllers {
    static async create(payload) {
        return UsersServices.create(payload);
    };

    static get(query = {}) {
        const filter = {
            email: query.email
        };
        return UsersServices.get(filter)
    };

    static async getOne(criteria){
        const user = await UsersServices.getOne(criteria);
        return user ? user : null;
    }
    
    static getById(uid) {
        return UsersServices.getById(uid);
    };

    static async updateById(uid, payload) {
        return UsersServices.updateById(uid, payload)
    };

    static deleteById(uid){
        return UsersServices.deleteById(uid);
    };
    
}