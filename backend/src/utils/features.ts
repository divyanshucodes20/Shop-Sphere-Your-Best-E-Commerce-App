import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";


export const invalidateCache=({product,admin,order,userId,orderId,productId,coupon}:InvalidateCacheProps)=>{
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
    myCache.del(["admin-line-charts",
    "admin-bar-charts","admin-pie-charts","admin-stats"])
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
    const percent=(thisMonth/lastMonth)*100;
    return Number(percent.toFixed(0));
}


export const getInventeries=async(
    {categories,productsCount}:
    {
        categories:string[];
        productsCount:number
    })=>{
    const categoriesCountPromise=categories.map((category)=>Product.countDocuments({category}))
    const categoriesCount=await Promise.all(categoriesCountPromise)

   const categoryCount:Record<string,number>[]=[];

   categories.forEach((category,i)=>{
       categoryCount.push({
           [category]:Math.round((categoriesCount[i]/productsCount)*100),
       })
   })
   return categoryCount;
}

export interface MyDocument extends Document{
    createdAt:Date;
    discount?:number;
    total?:number;
}
type FuncProps={
    length:number;
    docArr:MyDocument[];
    today:Date
    property?:"discount"|"total"
}

export const getChartData=({length,docArr,today,property}:FuncProps)=>{
    const data:number[]=new Array(length).fill(0)
    docArr.forEach((i)=>{
        const creationDate=i.createdAt;
        const monthDiff=(today.getMonth()-creationDate.getMonth()+12)%12
        if(monthDiff<length){
            if(property){
                data[length-monthDiff-1]+=i[property]!;
            }
            else{
                data[length-monthDiff-1]+=1;
            }
        }
    })
    return data
}