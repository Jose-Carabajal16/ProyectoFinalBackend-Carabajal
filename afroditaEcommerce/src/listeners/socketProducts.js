
import ProductManager from "../Dao/controllers/Mongo/productManagerMongo.js";
import { __dirname } from "../utils.js";
const productManager = new ProductManager();

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id);
        
        // obtener lista de productos al conectarse el cliente
        const listadeproductos = await productManager.getProductsView();
        socketServer.emit("enviodeproducts", listadeproductos);

        // agregar un producto
        socket.on("addProduct", async (obj) => {
            await productManager.addProduct(obj);
            const listadeproductos = await productManager.getProductsView();
            socketServer.emit("enviodeproducts", listadeproductos);
        });

        // eliminar un producto
        socket.on("deleteProduct", async (id) => {
            await productManager.deleteProduct(id);
            const listadeproductos = await productManager.getProductsView();
            socketServer.emit("enviodeproducts", listadeproductos);
        });
    });
};

export default socketProducts;
