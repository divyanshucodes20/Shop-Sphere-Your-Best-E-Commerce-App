import express from "express"
import { adminOnly } from "../middlewares/auth.js"
import { getBarStats, getDashboardStats, getLineStats, getPieStats } from "../controllers/stats.js"


const app=express.Router()

app.get("/stats",adminOnly,getDashboardStats)
app.get("/pie",adminOnly,getPieStats)
app.get("/bar",adminOnly,getBarStats)
app.get("/line",adminOnly,getLineStats)

export default app 
 