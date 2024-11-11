import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";

export const newProduct=TryCatch(
    async(req:Request<{},{},NewProductRequestBody>,res,next)=>{

    }
)