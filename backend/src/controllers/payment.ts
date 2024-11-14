import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const newCoupon=TryCatch(
    async(req,res,next)=>{
        const {coupon,amount}=req.body
        if(!coupon||!amount){
            return next(new ErrorHandler("Please add all feilds",400))
        }
        await Coupon.create({
            code:coupon,
            amount
        })
        return res.status(201).json({
            success:true,
            message:"Coupon Created Sucessfully"
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