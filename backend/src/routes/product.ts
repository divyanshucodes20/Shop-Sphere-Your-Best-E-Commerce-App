import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { newProduct } from "../controllers/product.js";
const app=express.Router()


app.post("/new",adminOnly,newProduct)
export default app;