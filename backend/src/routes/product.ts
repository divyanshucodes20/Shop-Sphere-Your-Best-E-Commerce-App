import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { getLatestProducts, newProduct,getAllCategories,getAdminProducts, getProductById, updateProduct, deleteProduct, getAllProducts } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app=express.Router()

// @ts-ignore
app.post("/new",adminOnly,singleUpload,newProduct)
// @ts-ignore
app.get("/latest",getLatestProducts)
// @ts-ignore
app.get("/categories",getAllCategories)
// @ts-ignore
app.get("/all",getAllProducts)
// @ts-ignore
app.get("/admin-products",adminOnly,getAdminProducts)
// @ts-ignore
app.route("/:id").get(getProductById).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,deleteProduct)

export default app;