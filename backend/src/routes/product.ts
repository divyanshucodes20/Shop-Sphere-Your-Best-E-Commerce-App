import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { getLatestProducts, newProduct,getAllCategories,getAdminProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app=express.Router()


app.post("/new",adminOnly,singleUpload,newProduct)
app.get("/latest",getLatestProducts)
app.get("/categories",getAllCategories)
app.get("/admin-products",adminOnly,getAdminProducts)
app.route("/:id").get(getProductById).put(singleUpload,updateProduct).delete(deleteProduct)
export default app;