import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

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
       return res.status(201).json({
        success:true,
        message:"Product Created Successfully"
       })
    }
)
export const getLatestProducts=TryCatch(
    async(req,res,next)=>{
      const products=await Product.find({}).sort({createdAt:-1}).limit(5)
      res.status(200).json({
        success:true,
        products
      })  
    }
)
export const getAllCategories=TryCatch(
    async(req,res,next)=>{
    const categories=await Product.distinct("category")
        res.status(200).json({
            success:true,
            categories
          })  
    }
)
export const getAdminProducts=TryCatch(
    async(req,res,next)=>{
    const products=await Product.find({})
        res.status(200).json({
            success:true,
            products
          })  
    }
)
export const getProductById=TryCatch(
    async(req,res,next)=>{
        const id=req.params.id
        const product=await Product.findById(id)
        if(!product){
            return next(new ErrorHandler("Product with this id not found",400))
        }
        res.status(200).json({
            success:true,
            product
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
        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
          })  
    }
)