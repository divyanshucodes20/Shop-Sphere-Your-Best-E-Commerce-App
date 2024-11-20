import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { getBarStats, getDashboardStats, getLineStats, getPieStats } from "../controllers/stats.js"


const app=express.Router()
// @ts-ignore
app.get("/stats",adminOnly,getDashboardStats)
// @ts-ignore
app.get("/pie",adminOnly,getPieStats)
// @ts-ignore
app.get("/bar",adminOnly,getBarStats)
// @ts-ignore
app.get("/line",adminOnly,getLineStats)

export default app 
 