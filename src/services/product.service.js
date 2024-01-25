import ProductDao from "../dao/product.dao.js";

export default class ProductsServices {
    static async create(payload) {
        const product = await ProductDao.create(payload);
        console.log(`Producto creado correctamente. ID: ${product._id}`); 
        return product;
    };

    static get(filter = {}) {
        return ProductDao.get(filter);
    };

    static getById(pid) {
        return ProductDao.getById(pid);
        
    };

    static findOne(query) {
        return ProductDao.findOne(query);
    }

    static async updateById(pid, data) {
        const updatedProduct = await ProductDao.updateById(pid, data);
        return updatedProduct;
    }

    static deleteById(pid){
        return ProductDao.deleteById(pid);
    };

    static  paginate(criteria, options) {
        return ProductDao.paginate(criteria, options);
    }
}