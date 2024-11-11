import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.js";
import connectDB from "./db/index.js";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config();

const app = express();
app.use(express.json());

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

// Root endpoint
app.get("/", (req, res) => {
    res.send("API is working! Use /api/v1 for routes.");
});

// User routes
app.use("/api/v1/user", userRoute);

// Error handling middleware
app.use(errorMiddleware);
