import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js"
import orderRoute from "./routes/order.js"
import paymentRoute from "./routes/payment.js"
import dashboardRoute from "./routes/stats.js"
import connectDB from "./db/index.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan"
import Stripe from "stripe";
import cors from "cors"

dotenv.config({
    path:"./.env"
});

const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors())

const port = process.env.PORT || 3000;

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // Exit the application
    });
export const stripeKey=process.env.STRIPE_KEY||""
export const stripe=new Stripe(stripeKey)

export const myCache=new NodeCache()
// Root endpoint
app.get("/", (req, res) => {
    res.send("API is working! Use /api/v1 for routes.");
});

// User routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/order",orderRoute)
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/dashboard",dashboardRoute)



app.use("/uploads",express.static("uploads"))

// Error handling middleware
// @ts-ignore
app.use(errorMiddleware);
