import mongoose,{Schema} from "mongoose";
 
const couponSchema= new Schema({
    code:{
        type:String,
        required:[true,"Please enter Coupon Code"],
        unique:true,
    },
    amount:{
        type:Number,
        required:[true,"Please add discount added to the above coupon"]
    }
})
 export const Coupon=mongoose.model("Coupon",couponSchema);