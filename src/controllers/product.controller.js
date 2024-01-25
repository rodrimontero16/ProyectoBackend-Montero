import ProductsServices from "../services/product.service.js";
import { Exception } from "../utils/utils.js";

export default class ProductsControllers {
    static async get(query){
        return await ProductsServices.get(query);
    };

    static async getById(pid){
        const product = await ProductsServices.getById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        return product;
    };

    static async create(data){
        const newProduct = await ProductsServices.create(data); 
        console.log('Producto agregado correctamente ✔️', newProduct);
        return newProduct;
    };
    
    static async findOne(query) {
        return await ProductsServices.findOne(query);
    }

    static async updateById(pid, data){
        const product = await ProductsServices.getById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        const criteria = { _id: pid };
        const operation = { $set: data };
        await ProductsServices.updateById( criteria, operation );
        console.log('Producto actualizado correctamente ✔️');
    };

    static async deleteById(pid){
        const product = await ProductsServices.getById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        const criteria = { _id: pid };
        await ProductsServices.deleteById(criteria);
        console.log('Producto eliminado correctamente ✔️');
    };

    static async paginate(criteria, options) {
        return await ProductsServices.paginate(criteria, options);
    }
}