import { configureStore } from "@reduxjs/toolkit";
import { prodctAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";

export const server=import.meta.env.VITE_SERVER

export const store=configureStore({
    reducer:{
    [userAPI.reducerPath]:userAPI.reducer,
    [prodctAPI.reducerPath]:prodctAPI.reducer,
    [userReducer.name]:userReducer.reducer,
    [cartReducer.name]:cartReducer.reducer,
    },
    middleware: (mid) => mid().concat(userAPI.middleware,prodctAPI.middleware)
})