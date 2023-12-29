import userModel from '../models/user.model.js'

export default class userDao {
    create(data) {
        return userModel.create(data);
    };

    get(filter = {}) {
        const criteria = {};
        if (filter.id){
            criteria._id = id;
        }
        return userModel.find(criteria);
    };

    getOne(criteria){
        return userModel.findOne(criteria)
    }

    getById(uid) {
        return userModel.findById(uid);
        
    };

    updateById(uid, data) {
        return userModel.updateOne({_id: uid}, {$set: data});
    };

    deleteById(uid){
        return userModel.deleteOne({ _id: uid });
    };
}