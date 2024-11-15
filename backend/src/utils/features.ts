import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";


export const invalidateCache=async({product,admin,order,userId,orderId,productId,coupon}:InvalidateCacheProps)=>{
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
    if(coupon){
        const couponKeys:string[]=["all-coupons"]
        myCache.del(couponKeys)
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

export const calculatePercentage=(thisMonth:number,lastMonth:number)=>{
    if(lastMonth===0){
        return thisMonth*100//avoid divide by zer0 in division
    }
    const percent=((thisMonth-lastMonth)/lastMonth)*100;
    return Number(percent.toFixed(0));
}