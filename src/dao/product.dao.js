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

    static findOne(query) {
        return productModel.findOne(query);
    }

    static updateById(pid, data) {
        return productModel.findByIdAndUpdate(pid, data, { new: true });
    };

    static deleteById(pid){
        return productModel.deleteOne({ _id: pid });
    };

    static  paginate(criteria, options) {
        return productModel.paginate(criteria, options);
    }
}