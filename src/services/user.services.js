import userDao from "../dao/user.dao.js";

export default class UsersServices {
    static async create(payload) {
        const user = await userDao.create(payload);
        console.log(`Usuario creado correctamente. ID: ${user._id}`); 
        return user;
    };

    static get(filter = {}) {
        return userDao.get(filter);
    };

    static getOne(criteria){
        return userDao.getOne(criteria)
    }

    static getById(uid) {
        return userDao.getById(uid);
    };

    static updateById(uid, payload) {
        return userDao.updateById(uid, payload)
    };

    static deleteById(uid){
        return userDao.deleteById(uid);
    };
    
}