import { productsModel } from "../../models/products.model.js";

export default class ProductManager {

    // obtener categorías
    categories = async () => {
        try {
            const categories = await productsModel.distinct("category");
            console.log("Categorías obtenidas:", categories);
            return categories;
        } catch (err) {
            console.log("Error al obtener categorías:", err);
            return err;
        }
    }

    // obtener productos con paginación
    getProducts = async (filter, options) => {
        try {
            const products = await productsModel.paginate(filter, options);
            console.log("Productos obtenidos:", products);
            return products;
        } catch (err) {
            console.log("Error al obtener productos:", err);
            return err;
        }
    }

    // obtener productos para vista
    getProductsView = async () => {
        try {
            const products = await productsModel.find().lean();
            console.log("Productos para la vista obtenidos:", products);
            return products;
        } catch (err) {
            console.log("Error al obtener productos para la vista:", err);
            return err;
        }
    }

    // obtener producto por id
    getProductById = async (id) => {
        try {
            const product = await productsModel.findById(id);
            console.log("Producto obtenido por ID:", product);
            return product;
        } catch (err) {
            console.log("Error al obtener producto por ID:", err.message);
            return { error: err.message };
        }
    }

    // agregar un producto
    addProduct = async (product) => {
        try {
            await productsModel.create(product);
            const newProduct = await productsModel.findOne({ title: product.title });
            console.log("Producto agregado:", newProduct);
            return newProduct;
        } catch (err) {
            console.log("Error al agregar producto:", err);
            return err;
        }
    }

    // actualizar un producto
    updateProduct = async (id, product) => {
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate(id, { $set: product });
            console.log("Producto actualizado:", updatedProduct);
            return updatedProduct;
        } catch (err) {
            console.log("Error al actualizar producto:", err);
            return err;
        }
    }

    // eliminar un producto
    deleteProduct = async (id) => {
        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            console.log("Producto eliminado:", deletedProduct);
            return deletedProduct;
        } catch (err) {
            console.log("Error al eliminar producto:", err);
            return err;
        }
    }
}
