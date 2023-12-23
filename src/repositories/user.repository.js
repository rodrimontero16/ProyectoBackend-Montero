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
        const [first_name, last_name] = data.fullName.splite(' ');
        const newData = {
            first_name,
            last_name,
            email,
            id
        }
        const user = await this.dao.create(newData);
        return new UserDTO(user);
    }

    updateById(uid, data){
        return this.dao.updateById(uid, data);
    }

    deleteById(uid){
        return this.dao.deleteById(uid);
    }

    async getOne(criteria){
        const user = await this.dao.getOne(criteria);
        return new UserDTO(user);
    }

    getById(uid){
        return this.dao.getById(uid);
    }
};