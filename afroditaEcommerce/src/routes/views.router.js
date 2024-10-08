import { Router } from 'express';
import ProductManager from '../Dao/controllers/Mongo/productManagerMongo.js';
import CartManager from '../Dao/controllers/Mongo/cartManagerMongo.js';
import { __dirname } from "../utils.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();

let cart = [];

router.get("/", async (req, res) => {
    const listadeproductos = await productManager.getProductsView();
    res.render("home", { listadeproductos });
});

router.get('/products', async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query;

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) },
            lean: true
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

        // Devuelve un array con las categorias disponibles y compara con la query "category"
        const categories = await productManager.categories();

        const result = categories.some(categ => categ === category);
        if (result) {
            const products = await productManager.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products;

            if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' });

            return res.render('products', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
        }

        const products = await productManager.getProducts({}, options);
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products;
        const { prevLink, nextLink } = links(products);

        if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' });

        return res.render('products', { products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
    } catch (error) {
        console.log(error);
    }
});

router.get('/products/inCart', async (req, res) => {
    const productsInCart = await Promise.all(cart.map(async (product) => {
        const productDB = await productManager.getProductById(product._id);
        return { title: productDB.title, quantity: product.quantity };
    }));

    return res.send({ cartLength: cart.length, productsInCart });
});

router.post('/products', async (req, res) => {
    try {
        const { product, finishBuy } = req.body;

        if (product) {
            if (product.quantity > 0) {
                const findId = cart.findIndex(productCart => productCart._id === product._id);
                (findId !== -1) ? cart[findId].quantity += product.quantity : cart.push(product);
            } else {
                return res.render('products', { message: 'Quantity must be greater than 0' });
            }
        }
        if (finishBuy) {
            await cartManager.addCart(cart);
            cart.splice(0, cart.length);
        }

        return res.render('products');
    } catch (error) {
        console.log(error);
    }
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realtimeproducts");
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const result = await cartManager.getCartById(cid);

        if (result === null || typeof(result) === 'string') return res.render('cart', { result: false, message: 'ID not found' });

        return res.render('cart', { result });

    } catch (err) {
        console.log(err);
    }
});

export default router;
