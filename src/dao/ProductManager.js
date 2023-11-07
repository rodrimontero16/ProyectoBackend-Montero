import productModel from '../dao/models/product.model.js';
import { Exception } from '../utils.js';

export default class ProductManager {
    static async get(){
        return await productModel.find();
    };

    static async getById(pid){
        const product = await productModel.findById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        return product;
    };

    static async create(data){
        const newProduct = await productModel.create(data); 
        console.log('Producto agregado correctamente ✔️');
        return newProduct;
    };
    
    static async findOne(query) {
        return await productModel.findOne(query);
    }

    static async updateById(pid, data){
        const product = await productModel.findById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        const criteria = { _id: pid };
        const operation = { $set: data };
        await productModel.updateOne( criteria, operation );
        console.log('Producto actualizado correctamente ✔️');
    };

    static async deleteById(pid){
        const product = await productModel.findById(pid);
        if(!product){
            throw new Exception('Producto no encontrado ❌', 404);
        };
        const criteria = { _id: pid };
        await productModel.deleteOne(criteria);
        console.log('Producto eliminado correctamente ✔️');
    };

    static async paginate(criteria, options) {
        return await productModel.paginate(criteria, options);
    }
};