import UserDTO from "../dto/user.dto.js";

export default class UserRepository {
    constructor(dao){
        this.dao = dao;
    };

    async get(filter = {}){
        const users = await this.dao.get(filter);
        return users.map(user => new UserDTO(user));
    }

    async create(data){
        const user = await this.dao.create(data);
        if (!user) {
            throw new Error("Usuario no creado");
        }

        return user;
    }

    async updateById(uid, data){
        return this.dao.updateById(uid, data);
    }

    deleteById(uid){
        return this.dao.deleteById(uid);
    }

    async getOne(criteria){
        const user = await this.dao.getOne(criteria);
        return user ? new UserDTO(user) : null;
    }

    getById(uid){
        return this.dao.getById(uid);
    }
};