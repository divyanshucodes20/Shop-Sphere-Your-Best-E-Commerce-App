import express from "express";

import { newUser,getAllUsers, getUser,deleteUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app=express.Router();
// @ts-ignore
app.post("/new",newUser)
// @ts-ignore
app.get("/all",adminOnly,getAllUsers)
// @ts-ignore
app.route("/:id").get(getUser).delete(adminOnly, deleteUser)
export default app;