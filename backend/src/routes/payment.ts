import express from "express";
import { adminOnly } from "../middlewares/auth.js"
import { applyDiscount, createPaymentInstance, deleteCoupon, getAllCoupons, newCoupon } from "../controllers/payment.js";

const app=express.Router();
// @ts-ignore
app.post("/create",createPaymentInstance)

// @ts-ignore
app.post("/coupon/new",adminOnly,newCoupon)
// @ts-ignore
app.get("/discount",applyDiscount)
// @ts-ignore
app.get("/coupon/all",adminOnly,getAllCoupons)
// @ts-ignore
app.delete("/coupon/:id",adminOnly,deleteCoupon)
export default app