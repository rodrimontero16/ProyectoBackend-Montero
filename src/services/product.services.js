import ProductDao from "../dao/product.dao.js";

export default class ProductsServices {
    static async create(payload) {
        const product = await ProductDao.create(payload);
        console.log(`Carrito creado correctamente. ID: ${product._id}`); 
        return product;
    };

    static get(filter = {}) {
        return ProductDao.get(filter);
    };

    static getById(pid) {
        return ProductDao.getById(pid);
        
    };

    static updateById(pid, payload) {
        return ProductDao.updateById(pid, payload)
    };

    static deleteById(pid){
        return CartProductDaoDao.deleteById(pid);
    };

    static  paginate(criteria, options) {
        return ProductDao.paginate(criteria, options);
    }
}