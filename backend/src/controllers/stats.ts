import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage,  getInventeries,getChartData } from "../utils/features.js";

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
        const monthDiff=(today.getMonth()-creationDate.getMonth()+12)%12
        if(monthDiff<6){
            orderMonthCounts[6-monthDiff-1]+=1;
            orderMonthlyRevenue[6-monthDiff-1]+=order.total
        }
    })


    const categoryCount=await getInventeries({
        categories,
        productsCount
    });

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

const [processingOrder,shippedOrder,deliveredOrder,productsCount,productsOutofStock,categories,allOrders,allUsers,customerUsers,adminUsers]=await Promise.all([
    Order.countDocuments({status:"Processing"}),
    Order.countDocuments({status:"Shipped"}),
    Order.countDocuments({status:"Delivered"}),
    Product.countDocuments(),
    Product.countDocuments({stock:0}),
    Product.distinct("category"),
    Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]),
    User.find({}).select(["dob"]),
    User.countDocuments({role:"user"}),
    User.countDocuments({role:"admin"}),
])

const orderFullfillment={
    processing:processingOrder,
    shipped:shippedOrder,
    delivered:deliveredOrder
}

const productCategories=await getInventeries({
    categories,
    productsCount
});


const stockAvailability={
    inStock:productsCount-productsOutofStock,
    outOfStock:productsOutofStock
}

const grossIncome=allOrders.reduce((prev,order)=>prev+(order.total)||0,0)

const totalDiscount=allOrders.reduce((prev,order)=>prev+(order.discount)||0,0)

const productionCost=allOrders.reduce((prev,order)=>prev+(order.shippingCharges)||0,0)

const burnt=allOrders.reduce((prev,order)=>prev+(order.tax)||0,0)

const marketingCost=Math.round(grossIncome*(Number(process.env.marketingCostPercent)/100))

const netMargin=grossIncome-totalDiscount-productionCost-burnt-marketingCost

const revenueDistribution={
    netMargin,
    discount:totalDiscount,
    productionCost,
    burnt,
    marketingCost
}

const adminCustomer={
    admin:adminUsers,
    customer:customerUsers
}

const usersAgeGroup={
teen:allUsers.filter(i=>i.age<20).length,
adult:allUsers.filter((i)=>i.age>=20 && i.age<40).length,
old:allUsers.filter((i)=>i.age>=40).length
}

charts={
    orderFullfillment,
    productCategories,
    stockAvailability,
    revenueDistribution,
    usersAgeGroup,
    adminCustomer
}
myCache.set("admin-pie-charts",JSON.stringify(charts))
}
return res.status(200).json({
    success:true,
    charts
})
}))

export const getBarStats=TryCatch((async(req,res,next)=>{
let charts;
const key="admin-bar-charts"
if(myCache.has(key)){
    charts=JSON.parse(myCache.get(key)as string)
}
else{

    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

myCache.set(key,JSON.stringify(charts))
}
return res.status(200).json({
    success:true,
    charts
}) 
}))

export const getLineStats=TryCatch((async(req,res,next)=>{
    let charts;
    const key="admin-line-charts"
    if(myCache.has(key)){
        charts=JSON.parse(myCache.get(key)as string)
    }
    else{
    
        const today = new Date();
 
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    

        const baseQuery={
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
              },
        }

        const twelveMonthProductsPromise = Product.find(baseQuery).select("createdAt");
          const twelveMonthUsersPromise = User.find(
            baseQuery).select("createdAt");
        const twelveMonthOrdersPromise = Order.find(
            baseQuery).select(["createdAt","discount","total"]);
    
        const [products, users, orders] = await Promise.all([
          twelveMonthProductsPromise,
          twelveMonthUsersPromise,
          twelveMonthOrdersPromise
        ]);
    
        const productCounts = getChartData({ length: 12, today, docArr: products });
        
        const usersCounts = getChartData({ length: 12, today, docArr: users });
        
        const discount = getChartData({ length: 12, today, docArr: orders,property:"discount" });
    
        const revenue = getChartData({ length: 12, today, docArr: orders,property:"total" });

        charts = {
          users: usersCounts,
          products: productCounts,
          discount,
          revenue
        };
    
    myCache.set(key,JSON.stringify(charts))
    }
    return res.status(200).json({
        success:true,
        charts
    }) 
}))
