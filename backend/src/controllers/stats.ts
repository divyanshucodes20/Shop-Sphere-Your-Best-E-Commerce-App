import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats=TryCatch((async(req,res,next)=>{
let stats={};
if(myCache.has("admin-stats")){
    stats=JSON.parse(myCache.get("admin-stats")as string)
}
else{
    
const today=new Date();

const sixMonthsAgo=new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6)

const thisMonth={
    start:new Date(today.getFullYear(),today.getMonth(),1),
    end:today
}
const lastMonth={
   start:new Date(
    today.getFullYear(),
    today.getMonth()-1,
    1),
   end:new Date(
    today.getFullYear(),
    today.getMonth(),
    0
)
}
//Products Stats
const thisMonthProductsPromise= Product.find({
createdAt:{
    $gte:thisMonth.start,
    $lte:thisMonth.end
}
})
const lastMonthProductsPromise= Product.find({
    createdAt:{
        $gte:lastMonth.start,
        $lte:lastMonth.end
}})
//Users Stats
const thisMonthUsersPromise= User.find({
    createdAt:{
        $gte:thisMonth.start,
        $lte:thisMonth.end
    }
    })
 const lastMonthUsersPromise= User.find({
        createdAt:{
            $gte:lastMonth.start,
            $lte:lastMonth.end
    }})
    //orders stats
    const thisMonthOrderssPromise= Order.find({
        createdAt:{
            $gte:thisMonth.start,
            $lte:thisMonth.end
        }
        })
        const lastMonthOrdersPromise= Order.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end
        }})

        const lastSixMonthOrdersPromise= Order.find({
            createdAt:{
                $gte:sixMonthsAgo,
                $lte:today
        }})

        const latestTransactionPromise=Order.find({}).select(["orderItems","discount","total","status"]).limit(4)

       const [thisMonthProducts,
        thisMonthUsers,
        thisMonthOrders,
        lastMonthProducts,
        lastMonthUsers,
        lastMonthOrders,productsCount,usersCount,allOrders,
        lastSixMonthOrders,
    categories,
femaleUserCounts,
latestTransaction]=
        await Promise.all([
        thisMonthProductsPromise,thisMonthUsersPromise,thisMonthOrderssPromise,lastMonthProductsPromise,lastMonthUsersPromise,lastMonthOrdersPromise,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthOrdersPromise,
        Product.distinct("category"),
        User.countDocuments({gender:"female"}),
        latestTransactionPromise
    ]) 
    const thisMonthRevenue=thisMonthOrders.reduce((total,order)=>total+(order.total||0),0)

    const lastMonthRevenue=lastMonthOrders.reduce((total,order)=>total+(order.total||0),0)

    const changePercent={
        product:calculatePercentage(thisMonthProducts.length,lastMonthProducts.length),
        user:calculatePercentage(thisMonthUsers.length,lastMonthUsers.length),
        order:calculatePercentage(thisMonthOrders.length,lastMonthOrders.length),
        revenue:calculatePercentage(thisMonthRevenue,lastMonthRevenue)
    }
    
    const revenue=allOrders.reduce(
        (total,order)=>total+(order.total||0),0
    )
    const count={
      product:productsCount,
      user:usersCount,
      order:allOrders.length,
      revenue
    }  
    const orderMonthCounts=new Array(6).fill(0)
    const orderMonthlyRevenue=new Array(6).fill(0)

    lastSixMonthOrders.forEach((order)=>{
        const creationDate=order.createdAt;
        const monthDiff=today.getMonth()-creationDate.getMonth()
        if(monthDiff<6){
            orderMonthCounts[6-monthDiff-1]+=1;
            orderMonthlyRevenue[6-monthDiff-1]+=order.total
        }
    })

    const categoriesCountPromise=categories.map((category)=>Product.countDocuments({category}))
     const categoriesCount=await Promise.all(categoriesCountPromise)

    const categoryCount:Record<string,number>[]=[];

    categories.forEach((category,i)=>{
        categoryCount.push({
            [category]:Math.round((categoriesCount[i]/productsCount)*100),
        })
    })
    const userRatio={
        male:usersCount-femaleUserCounts,
        female:femaleUserCounts
    }
    const modifiedLatestTransaction=latestTransaction.map(i=>({
        _id:i._id,
        discount:i.discount,
        amount:i.total,
        quantity:i.orderItems.length,
        status:i.status
    }))
   

    stats={
        categoriesCount,
        categoryCount,
        changePercent,
        count,
        chart:{
            order:orderMonthCounts,
            revenue:orderMonthlyRevenue
        },
        userRatio,
        latestTransaction:modifiedLatestTransaction
    }
    
    myCache.set("admin-stats",JSON.stringify(stats))
}
return res.status(200).json({
    success:true,
    stats
})
}))

export const getPieStats=TryCatch((async(req,res,next)=>{
let charts;
if(myCache.has("admin-pie-charts")){
    charts=JSON.parse(myCache.get("admin-pie-charts")as string)
}
else{

const [processingOrder,shippedOrder,deliveredOrder]=await Promise.all([
    Order.countDocuments({status:"Processing"}),
    Order.countDocuments({status:"Shipped"}),
    Order.countDocuments({status:"Delivered"}),
])

const orderFullfillment={
    processing:processingOrder,
    shipped:shippedOrder,
    delivered:deliveredOrder
}
charts={
    orderFullfillment
}
myCache.set("admin-pie-charts",JSON.stringify(charts))
}
return res.status(200).json({
    success:true,
    charts
})
}))

export const getBarStats=TryCatch((async(req,res,next)=>{

}))

export const getLineStats=TryCatch((async(req,res,next)=>{

}))
