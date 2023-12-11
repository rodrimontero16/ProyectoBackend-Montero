import productModel from "../models/product.model.js";

export default class ProductDao {
    static create(data) {
        return productModel.create(data);
    };

    static get(criteria = {}) {
        return productModel.find(criteria);
    };

    static getById(pid) {
        return productModel.findById(pid);
        
    };

    static updateById(pid, data) {
        return productModel.updateOne({_id: pid}, {$set: data})
    };

    static deleteById(pid){
        return productModel.deleteOne({ _id: pid });
    };

    static  paginate(criteria, options) {
        return productModel.paginate(criteria, options);
    }
}