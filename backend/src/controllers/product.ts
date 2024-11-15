import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import {SearchRequestQuery,BaseQueryType} from "../types/types.js"
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
//import {faker} from "@faker-js/faker"



export const newProduct=TryCatch(
    async(req:Request<{},{},NewProductRequestBody>,res,next)=>{
       const {name,price,stock,category}=req.body;
       const photo=req.file
       if(!photo){
        return next(new ErrorHandler("Please upload photo",400))
       }
       if(!name||!price||!stock||!category){
        rm(photo.path,()=>{
            console.log("deleted")
        })
        return next(new ErrorHandler("all feilds are required",400))
       }
       await Product.create({
        name,price,stock,
        category:category.toLowerCase(),
        photo:photo.path
       })
      await  invalidateCache({product:true})
       return res.status(201).json({
        success:true,
        message:"Product Created Successfully"
       })
    }
)
export const updateProduct=TryCatch(
    async(req,res,next)=>{
        const { id }=req.params
        const {name,price,stock,category}=req.body
        const photo=req.file
        const product=await Product.findById(id)
        if(!product){
            return next(new ErrorHandler("Product with this id not found",400))
        }
        if(photo){
           rm(product.photo!,()=>{
            console.log("deleted")
           })
           product.photo=photo.path 
        }
        if(name) product.name=name
        if(price) product.price=price
        if(stock) product.stock=stock
        if(category) product.category=category
        await product.save()
        await  invalidateCache({product:true,productId:String(product._id)})
        res.status(200).json({
            success:true,
            message:"Product Updated Successfully"
          })  
    }
)
export const deleteProduct=TryCatch(
    async(req,res,next)=>{
        const {id}=req.params
        const product=await Product.findById(id)
        if(!product){
            return next(new ErrorHandler("Product with this id not found",404))
        }
        rm(product.photo!,()=>{
            console.log("deleted")
           })
        await product.deleteOne()
        await  invalidateCache({product:true,productId:String(product._id)})
        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
          })  
    }
)
//Revalidate cache on new,update,delete product&on new order
export const getLatestProducts=TryCatch(
    async(req,res,next)=>{
        let products=[];
        if(myCache.has("latest-products")){
            products=JSON.parse(myCache.get("latest-products")as string)
        }
      else{products=await Product.find({}).sort({createdAt:-1}).limit(5)
      myCache.set("latest-product",JSON.stringify(products))
    }
      res.status(200).json({
        success:true,
        products
      })
    }
)
//Revalidate cache on new,update,delete product&on new order
export const getAllCategories=TryCatch(
    async(req,res,next)=>{
        let categories;
    if(myCache.has("categories")){
        categories=JSON.parse(myCache.get("categories")as string)
    }
    else{categories=await Product.distinct("category")
      myCache.set("categories",JSON.stringify(categories))
    }
        res.status(200).json({
            success:true,
            categories
          })  
    }
)
export const getAdminProducts=TryCatch(
    async(req,res,next)=>{
        let products;
        if(myCache.has("admin-products")){
        products=JSON.parse(myCache.get("admin-products")as string)
    }
    else{
        products=await Product.find({})
        myCache.set("admin-products",JSON.stringify(products))
    }
        res.status(200).json({
            success:true,
            products
          })  
    }
)
export const getProductById=TryCatch(
    async(req,res,next)=>{
        let product;
        const id=req.params.id
        if(myCache.has(`product-${id}`)){
            product=JSON.parse(myCache.get(`product-${id}`)as string)
        }
        else {product=await Product.findById(id)
        if(!product){
            return next(new ErrorHandler("Product with this id not found",400))
        }
        myCache.set(`product-${id}`,JSON.stringify(product))
    }
        res.status(200).json({
            success:true,
            product
          })  
    }
)


export const getAllProducts=TryCatch(
    async(req:Request<{},{},{},SearchRequestQuery>,res,next)=>{
        const {search,price,category,sort}=req.query
        const page=Number(req.query.page)||1
        const limit= Number(process.env.PRODUCT_PER_PAGE)||8
        const skip=limit*(page-1)
        const baseQuery:BaseQueryType={}
    if(search){ 
        baseQuery.name={
            $regex:search,
            $options:"i",
        }
    }
    if(price){
        baseQuery.price={
            $lte:Number(price)
        }
    }
    if(category){
       baseQuery.category=category 
    }
    const [products,filteredOnlyProducts]=await Promise.all([
        Product.find(baseQuery).sort(sort && {price:sort==="asc"?1:-1}).limit(limit).skip(skip),
        Product.find(baseQuery)
    ])//do baar await bachane aur dono query parallely chalane ke liye 
        const totalPages=Math.ceil(filteredOnlyProducts.length/limit)
        return res.status(200).json({
            success:true,
            products,
            totalPages
        })
    }
)
//genrate random data for testing purpose
/*const generateRandomProducts=async(count:number=10)=>{
    const products=[]
    for(let i=0;i<count;i++){
        const product={
            name:faker.commerce.productName(),
            photo:"uploads\be9cb719-dea1-4414-bd04-4147a914b266.jpg",
            price:faker.commerce.price({min:1500,max:80000,dec:0}),
            stock:faker.commerce.price({min:0,max:100,dec:0}),
            category:faker.commerce.department(),
            createdAt:new Date(faker.date.past()),
            updatedAt:new Date(faker.date.recent()),
            _v:0,
        }
        products.push(product)
    }
    await Product.create(products)
}*/
/*const deleteRandomProducts=async(count:number=10)=>{
    const products=await Product.find({}).skip(2)
    for(let i=0;i<products.length;i++){
        const product=await products[i];
        await product.deleteOne()
    }
}*/
