
import mongoose from "mongoose";
import { config } from "./config/config.js";

export const conDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(`Error al conectar a la Base de datos: ${error.message}`);
    }
};
