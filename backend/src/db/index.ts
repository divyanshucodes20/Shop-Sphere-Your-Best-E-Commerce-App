import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { InvalidateCacheProps} from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
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

export const invalidateCache=async({product,admin,order}:InvalidateCacheProps)=>{
if(product){
    const productKeys:string[]=["latest-products","categories","admin-products"]
    const productIds=await Product.find({}).select("_id")
    productIds.forEach(i => {
        productKeys.push(`product-${i._id}`)
    });
    myCache.del(productKeys)
}
if(admin){

}

if(order){

}
}