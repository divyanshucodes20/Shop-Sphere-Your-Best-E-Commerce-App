import { NextFunction, Request, Response } from "express";



export interface NewUserRequestBody{
    _id:string,
    name:string,
    email:string,
    gender:"male"|"female",
    dob:Date,
}
export interface NewProductRequestBody{
    category:string,
    name:string,
    stock:number,
    price:number,
}
export type ControllerType=(
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise<void|Response<any,Record<string,any>>>