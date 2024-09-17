import { Router } from "express";
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";
const productManager = new ProductManager();

const router = Router();

router.get("/products", async (req, res) => {
    const products = await productManager.getProducts(req.query);
    res.json({ products });
});

router.get('/products', async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query;
        console.log(req.originalUrl);

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) }
        };

        if (!(options.sort.price === -1 || options.sort.price === 1)) {
            delete options.sort;
        }

        const links = (products) => {
            let prevLink, nextLink;
            if (req.originalUrl.includes('page')) {
                prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            }
            if (!req.originalUrl.includes('?')) {
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            }
            prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
            return { prevLink, nextLink };
        };

        const categories = await productManager.categories();
        const result = categories.some(categ => categ === category);
        
        if (result) {
            const products = await productManager.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
            return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        }

        const products = await productManager.getProducts({}, options);
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
        const { prevLink, nextLink } = links(products);

        if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' });

        return res.render('home', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page });
    } catch (error) {
        console.log(error);
    }
});

router.get("/products/:pid", async (req, res) => {
    const productfind = await productManager.getProductById(req.params);
    res.json({ status: "success", productfind });
});

router.post("/products", async (req, res) => {
    const newproduct = await productManager.addProduct(req.body);
    res.json({ status: "success", newproduct });
});

router.put("/products/:pid", async (req, res) => {
    const updatedproduct = await productManager.updateProduct(req.params, req.body);
    res.json({ status: "success", updatedproduct });
});

router.delete("/products/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const deleteproduct = await productManager.deleteProduct(id);
    res.json({ status: "success", deleteproduct });
});

export default router;
