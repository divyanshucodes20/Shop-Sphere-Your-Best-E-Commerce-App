import { configureStore } from "@reduxjs/toolkit";
import { prodctAPI } from "./api/productApi";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";

export const server=import.meta.env.VITE_SERVER

export const store=configureStore({
    reducer:{
    [userAPI.reducerPath]:userAPI.reducer,
    [prodctAPI.reducerPath]:prodctAPI.reducer,
    [userReducer.name]:userReducer.reducer,
    },
    middleware: (mid) => mid().concat(userAPI.middleware,prodctAPI.middleware)
})