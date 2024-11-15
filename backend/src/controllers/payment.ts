import { myCache, stripe } from "../app.js";
import { invalidateCache } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const createPaymentInstance=TryCatch(
    async(req,res,next)=>{
        const {amount}=req.body;
        if(!amount){
            return next(new ErrorHandler("Please Enter Amount",400))
        }
        const paymentIntent=await stripe.paymentIntents.create({amount:Number(amount)*100,
            currency:"inr"
        })
        return res.status(201).json({
            success:true,
            clientSecret:paymentIntent.client_secret
        })
    }
)


export const newCoupon=TryCatch(
    async(req,res,next)=>{
        const {coupon,amount}=req.body
        if(!coupon||!amount){
            return next(new ErrorHandler("Please add all feilds",400))
        }

const existingCoupon = await Coupon.findOne({ code: coupon });
if (existingCoupon) {
    return next(new ErrorHandler("Coupon code already exists", 400));
}
        await Coupon.create({
            code:coupon,
            amount
        })
        invalidateCache({coupon:true,admin:true})
        return res.status(201).json({
            success:true,
            message:"Coupon Created Sucessfully"
        })
    }
)

export const deleteCoupon=TryCatch(
    async(req,res,next)=>{
        const {id}=req.params
        const coupon=await Coupon.findByIdAndDelete(id);
        if(!coupon){
            return next(new ErrorHandler("Invalid CouponId",400))
        }
        invalidateCache({coupon:true,admin:true})
       res.status(200).json({
        success:true,
        message:"Coupon Deleted SuccessFully"
       })
    }
)

export const applyDiscount=TryCatch(
    async(req,res,next)=>{
        const {coupon}=req.query;
        const discount=await Coupon.findOne({code:coupon});
        if(!discount){
            return next(new ErrorHandler("Invalid Coupon Code",400))
        }
        return res.status(200).json({
            success:true,
            discount:discount.amount,
        })
    }
)

export const getAllCoupons=TryCatch(
    async(req,res,next)=>{
        let coupons;
         if(myCache.has("all-coupons")){
            coupons=JSON.parse(myCache.get("all-coupons")as string)
         }
         else{
        coupons=await Coupon.find({});
        myCache.set("all-coupons",JSON.stringify(coupons))
         }
        return res.status(200).json({
            success:true,
            coupons
        })
    }
)