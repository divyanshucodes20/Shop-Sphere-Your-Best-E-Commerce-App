import { NextFunction, Request, Response } from "express";



export interface NewUserRequestBody{
    _id:string;
    name:string;
    email:string;
    gender:"male"|"female";
    dob:Date;
}
export interface NewProductRequestBody{
    category:string;
    name:string;
    stock:number;
    price:number;
}
export type ControllerType=(
    req:Request,
    res:Response,
    next:NextFunction
)=>Promise<void|Response<any,Record<string,any>>>


export type SearchRequestQuery={
    search?:string;
    price?:string;
    category?:string;
    sort?:string;
    page?:string;
}
export interface BaseQueryType{
name?:{
    $regex:string;
    $options:"i";
};
price?:{
    $lte:number;
};
category?:string;
}
export type  InvalidateCacheProps={
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    userId?:string;
    orderId?:string;
    productId?:string|string[];
    coupon?:boolean;
}
export type OrderItemType={
    name:string;
    photo:string;
    price:number;
    quantity:number;
    productId:string;
}
export type ShippingInfoType={
    address:string;
    city:string;
    state:string;
    country:string;
    pinCode:number;
}
export interface NewOrderRequestBody{
  shippingInfo:{};
  user:string;
  subTotal:number;
  tax:number,
  shippingCharges:number,
  discount:number,
  total:number;
  orderItems:OrderItemType[]
}