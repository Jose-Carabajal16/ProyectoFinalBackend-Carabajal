import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"

import productRouter from "./routes/products.router.js";
import viewRouter from "./routes/views.router.js";
import socketProducts from "./listeners/socketproducts.js";

import connectToDB from "./Dao/config/configServer.js";
import cartRouter from "./routes/carts.router.js";
const app = express()
const PORT=8088
// Middleware para analizar el cuerpo JSON de la solicitud
app.use(express.json());
app.use(express.static(__dirname + "/public"))
//handlebars
app.engine("handlebars",handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine","handlebars")
//rutas
app.use("/api", productRouter)
app.use('/', viewRouter);
app.use("/api", cartRouter)
connectToDB()
const httpServer=app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/api/products`)
        console.log(`\t2). http://localhost:${PORT}/api/carts`);
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = new Server(httpServer)

socketProducts(socketServer)