import { Router } from 'express';
import { __dirname } from "../utils.js"
import ProductManager from '../dao/controllers/mongo/productManagerMongo.js';
const produManager = ProductManager; 

const router = Router()


router.get("/",async(req,res)=>{
    const listadeproductos=await produManager.getProductsView()
    console.log(listadeproductos)
    res.render("home",{listadeproductos})
    
})

router.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})





export default router