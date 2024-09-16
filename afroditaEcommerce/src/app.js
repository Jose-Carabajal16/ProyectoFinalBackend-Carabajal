import express from 'express';
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from 'socket.io';
import ProduManager from './dao/controllers/mongo/productManagerMongo.js';

// Importación de rutas
import productRoutes from "./routes/productsRoutes.js";
import viewsRouter from "./routes/viewsRouter.js";

// Importación del controlador
//import ProductManager from './dao/controllers/manager/productsManager.js';
import { conDB } from './conDB.js';

const app = express();
const PORT = 3000;
conDB();

// Instancia de ProductManager
//const productManager = new ProductManager(__dirname + '/dao/database/products.json'); 
const productManager = ProduManager
// Middleware
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Rutas
app.use("/api", productRoutes);
app.use('/', viewsRouter);

// Escuchando el puerto
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
const io = new Server(httpServer);

// Eventos de WebSocket
io.on('connection', async (socket) => {
    console.log("Cliente conectado con ID:", socket.id);
    
    try {
        const listaDeProductos = await productManager.getProductsView();
        console.log("Enviando productos al cliente:", listaDeProductos);
        socket.emit("enviodeproducts", listaDeProductos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }

    socket.on("addProduct", async (obj) => {
        console.log("Datos recibidos para agregar producto:", obj);
        try {
            await productManager.addProduct(obj);
            const listaDeProductos = await productManager.getProductsView();
            console.log("Actualizando productos después de agregar uno:", listaDeProductos);
            io.emit("enviodeproducts", listaDeProductos);
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            await productManager.deleteProduct(id);
            const listaDeProductos = await productManager.getProductsView();
            console.log("Actualizando productos después de eliminar uno:", listaDeProductos);
            io.emit("enviodeproducts", listaDeProductos);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    });
});
