import { Router } from 'express';
//import ProductManager from '../dao/controllers/manager/productsManager.js';
//const manager = new ProductManager(`${__dirname}/dao/database/products.json`);
import { __dirname } from '../utils.js';
import ProductManager from '../dao/controllers/mongo/productManagerMongo.js';
const produManager = ProductManager; 




const router = Router();

// Ruta para obtener todos los productos
router.get("/products", async (req, res) => {
    try {
        const products = await produManager.getProducts(req.query);
        res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por ID
router.get("/products/:pid", async (req, res) => {
    try {
        const productfind = await produManager.getProductbyId(req.params);
        if (!productfind) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', productfind });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener el producto' });
    }
});

// Ruta para agregar un nuevo producto
router.post("/products", async (req, res) => {
    try {
        const newproduct = await produManager.addProduct(req.body);
        res.status(201).json({ status: 'success', newproduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ status: 'error', error: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar un producto por ID
router.put("/products/:pid", async (req, res) => {
    try {
        const updatedproduct = await produManager.updateProduct(req.params, req.body);
        if (!updatedproduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', updatedproduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ status: 'error', error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por ID
router.delete("/products/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const deleteproduct = await produManager.deleteProduct(id);
        if (!deleteproduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.status(200).json({ status: 'success', deleteproduct });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ status: 'error', error: 'Error al eliminar el producto' });
    }
});

export default router;
