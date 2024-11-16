import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AllProductsResponse, MessageResponse, UserResponse } from "../../types/api-types"
import { User } from "../../types/types"
import axios from "axios"



export const prodctAPI=createApi({reducerPath:"prodcuctApi",baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER}/api/v1/product/`}),
endpoints:(builder)=>({
    latestProducts:builder.query<AllProductsResponse,string>({query:()=>"latest"}),
    allProducts:builder.query<AllProductsResponse,string>({query:()=>"admin-products"})
})
})


export const { useLatestProductsQuery,useAllProductsQuery }=prodctAPI