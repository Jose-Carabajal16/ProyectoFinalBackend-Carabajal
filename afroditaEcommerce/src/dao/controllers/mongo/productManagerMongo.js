import { productsModel } from "../../models/productsModels.js";

const ProductManager = {
    categories: async () => {
        try {
            const categories = await productsModel.distinct("category");
            return categories;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    getProducts: async (filter, options) => {
        try {
            return await productsModel.paginate(filter, options);
        } catch (err) {
            return err;
        }
    },

    getProductsView: async () => {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err;
        }
    },
    
    getProductById: async (id) => {
        try {
            return await productsModel.findById(id);
        } catch (err) {
            return { error: err.message };
        }
    },

    addProduct: async (product) => {
        try {
            await productsModel.create(product);
            return await productsModel.findOne({ name: product.name });
        } catch (err) {
            return err;
        }
    },

    updateProduct: async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (err) {
            return err;
        }
    },

    deleteProduct: async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err;
        }
    }
};

export default ProductManager;
