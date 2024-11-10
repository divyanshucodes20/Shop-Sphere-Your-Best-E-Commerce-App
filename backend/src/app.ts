import express from "express"


import userRoute from "./routes/user.js"
import connectDB from "./db/index.js";
import { errorMiddleware } from "./middlewares/error.js";
const app=express();
app.use(express.json())
const port=3000

connectDB()
app.get("/",(req,res)=>{
    res.send("API Working with /api/v1")
    })
app.use("/api/v1/user",userRoute)
app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Server is listening on http://localhost:${port}"`)
})