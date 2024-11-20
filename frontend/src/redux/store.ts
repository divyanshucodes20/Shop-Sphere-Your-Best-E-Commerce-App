import { configureStore } from "@reduxjs/toolkit";
import { prodctAPI } from "./api/productAPI";
// @ts-ignore
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardAPI";

export const server=import.meta.env.VITE_SERVER

export const store=configureStore({
    reducer:{
    [userAPI.reducerPath]:userAPI.reducer,
    [prodctAPI.reducerPath]:prodctAPI.reducer,
    [orderAPI.reducerPath]:orderAPI.reducer,
    [dashboardAPI.reducerPath]:dashboardAPI.reducer,
    [userReducer.name]:userReducer.reducer,
    [cartReducer.name]:cartReducer.reducer,
    },
    middleware: (mid) => mid().concat(userAPI.middleware,prodctAPI.middleware,orderAPI.middleware,dashboardAPI.middleware)
})
export type RootState = ReturnType<typeof store.getState>;