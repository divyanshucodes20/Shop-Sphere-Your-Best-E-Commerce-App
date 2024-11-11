import mongoose,{Schema} from "mongoose";

const productSchema=new Schema(
    {
        name:{
            type:String,
            required:[true,"Product Name is required"]
        },
        photo:{
            type:String,
            required:[true,"Product Image is required"]
        },
        price:{
            type:Number,
            require:[true,"Product Price is required"]
        },
        stock:{
            type:Number,
            require:[true,"Product Stock is required"]
        },
        category:{
            type:String,
            required:[true,"Product Category is required"]
        },
    },
    {
        timestamps:true
    }
)
export const Product=mongoose.model("Product",productSchema)