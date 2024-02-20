import UsersServices from "../services/user.service.js";

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

    static async updateUserRole(uid) {
        const user = await UsersServices.getById(uid);
        if (!user) {
            throw new Error(`No se encontró un usuario con ID: ${uid}`);
        };
        const newRole = user.role === 'user' ? 'premium' : 'user';
        user.role = newRole;
        console.log('Rol de usuario actualizado correctamente.');
        await user.save()
        return user; 
    }

    static async updateById(uid, payload) {
        return UsersServices.updateById(uid, payload)
    };

    static deleteById(uid){
        return UsersServices.deleteById(uid);
    };
    
    static async uploadFile (uid, typeFile, file){
    
    };
}