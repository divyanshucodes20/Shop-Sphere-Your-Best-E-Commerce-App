import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";

const app=express.Router()
// @ts-ignore
app.post("/new",newOrder)
// @ts-ignore
app.get("/my",myOrders)
// @ts-ignore
app.get("/all",adminOnly,allOrders)
// @ts-ignore
app.route("/:id").get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder)

export default app;