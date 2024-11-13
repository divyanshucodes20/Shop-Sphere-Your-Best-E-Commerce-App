import mongoose from "mongoose";
import { myCache } from "../app.js";
import { DB_NAME } from "../constants.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected!! DB_HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongo DB connection Error", error);
        process.exit(1);
    }
};

export default connectDB;

export const invalidateCache=async({product,admin,order,userId,orderId,productId}:InvalidateCacheProps)=>{
if(product){
    const productKeys:string[]=["latest-products","categories","admin-products"]
    if(typeof productId==="string"){
        productKeys.push(`product-${productId}`)
    }
    if(typeof productId==="object"){
        productId.forEach((i)=>productKeys.push(`product-${i}`))
    }
    myCache.del(productKeys)
}
if(admin){

}

if(order){
const orderKeys:string[]=["all-orders",`my-orders-${userId}`,`order-${orderId}`]
myCache.del(orderKeys)
}
}
export const reduceStock=async(orderItems:OrderItemType[])=>{
    for(let i=0;i<orderItems.length;i++){
        const order=orderItems[i];
        const product=await Product.findById(order.productId);
        if(!product){
            throw new Error("Product Nor Found")
        }
        product.stock-=order.quantity
        await product.save();
    }
}