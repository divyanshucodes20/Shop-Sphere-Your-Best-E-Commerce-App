import express from "express";
import { adminOnly } from "../middlewares/auth.js"
import { applyDiscount, newCoupon } from "../controllers/payment.js";

const app=express.Router();

app.post("/coupon/new",adminOnly,newCoupon)
app.get("/discount",applyDiscount)

export default app